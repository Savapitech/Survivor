import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Seeker, VideoStatus } from './entities/seeker.entity';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { FindSeekersQueryDto } from './dto/find-seekers-query.dto';
import { FindSeekersAdminQueryDto } from './dto/find-seekers-admin-query.dto';
import { ModerateSeekerVideoDto } from './dto/moderate-seeker-video.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Competence } from '../competences/entities/competence.entity';
import { Localisation } from '../localisations/entities/localisation.entity';
import { ActivitySector } from '../activity-sectors/entities/activity-sector.entity';
import {
  Interaction,
  InteractionType,
} from '../interactions/entities/interaction.entity';
import { Recruiter } from '../recruiters/entities/recruiter.entity';
import { paginate, toSkipTake } from '../common/pagination';
import { isMinor, toPublicSeeker } from './seeker-view.util';
import { VIDEO_CONSENT_VERSION } from './video-consent';
import { VideoProviderRegistry } from '../video-providers/video-provider.registry';
import {
  StoredVideoFile,
  VideoProviderName,
} from '../video-providers/video-provider.interface';
import { VideoProviderUnavailableError } from '../video-providers/video-provider.errors';
import { NO_VIDEO_VIEW, VideoView } from './video-view';

const SEEKER_RELATIONS = {
  competences: true,
  localisations: true,
  activitySectors: true,
} as const;

interface Requester {
  userId?: string;
  role?: UserRole;
}

function assertOwnerOrAdmin(requester: Requester | undefined, ownerUserId: string) {
  if (requester?.role === UserRole.ADMIN) return;
  if (requester?.userId === ownerUserId) return;
  throw new ForbiddenException('This profile does not belong to you');
}

function adultCutoffDate(): string {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return cutoff.toISOString().slice(0, 10);
}

@Injectable()
export class SeekersService {
  constructor(
    @InjectRepository(Seeker)
    private readonly seekersRepository: Repository<Seeker>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Competence)
    private readonly competencesRepository: Repository<Competence>,
    @InjectRepository(Localisation)
    private readonly localisationsRepository: Repository<Localisation>,
    @InjectRepository(ActivitySector)
    private readonly activitySectorsRepository: Repository<ActivitySector>,
    @InjectRepository(Interaction)
    private readonly interactionsRepository: Repository<Interaction>,
    @InjectRepository(Recruiter)
    private readonly recruitersRepository: Repository<Recruiter>,
    private readonly videoProviders: VideoProviderRegistry,
  ) {}

  private async resolveVideoView(seeker: {
    id: number;
    videoProvider: string | null;
    videoExternalId: string | null;
  }): Promise<VideoView> {
    if (!seeker.videoProvider || !seeker.videoExternalId) {
      return NO_VIDEO_VIEW;
    }
    const provider = this.videoProviders.get(
      seeker.videoProvider as VideoProviderName,
    );
    try {
      const technical = await provider.status(seeker.videoExternalId);
      if (technical === 'processing') {
        return { status: 'processing', playbackUrl: null };
      }
      if (technical === 'error') {
        return { status: 'unavailable', playbackUrl: null };
      }
      if (provider.name === 'local') {
        return {
          status: 'ready',
          playbackUrl: `/seekers/${seeker.id}/video/stream`,
        };
      }
      const url = await provider.playbackUrl(seeker.videoExternalId);
      return url ? { status: 'ready', playbackUrl: url } : { status: 'unavailable', playbackUrl: null };
    } catch (err) {
      if (err instanceof VideoProviderUnavailableError) {
        return { status: 'unavailable', playbackUrl: null };
      }
      throw err;
    }
  }

  private async attachVideoView<
    T extends { id: number; videoProvider: string | null; videoExternalId: string | null },
  >(items: T[]): Promise<(T & { videoView: VideoView })[]> {
    return Promise.all(
      items.map(async (item) => ({
        ...item,
        videoView: await this.resolveVideoView(item),
      })),
    );
  }

  private async attachLikeCounts<T extends { id: number }>(
    seekers: T[],
  ): Promise<(T & { likeCount: number })[]> {
    if (seekers.length === 0) {
      return [];
    }
    const rows = await this.interactionsRepository
      .createQueryBuilder('interaction')
      .select('seeker.id', 'seekerId')
      .addSelect('COUNT(*)', 'count')
      .innerJoin('interaction.seeker', 'seeker')
      .where('interaction.type = :type', { type: InteractionType.LIKE })
      .andWhere('seeker.id IN (:...ids)', {
        ids: seekers.map((s) => s.id),
      })
      .groupBy('seeker.id')
      .getRawMany<{ seekerId: number; count: string }>();

    const counts = new Map(rows.map((r) => [r.seekerId, Number(r.count)]));
    return seekers.map((seeker) => ({
      ...seeker,
      likeCount: counts.get(seeker.id) ?? 0,
    }));
  }

  private async resolveCompetences(ids?: number[]): Promise<Competence[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const found = await this.competencesRepository.findBy({ id: In(ids) });
    if (found.length !== ids.length) {
      throw new BadRequestException('Unknown competence id(s)');
    }
    return found;
  }

  private async resolveLocalisations(ids?: number[]): Promise<Localisation[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const found = await this.localisationsRepository.findBy({ id: In(ids) });
    if (found.length !== ids.length) {
      throw new BadRequestException('Unknown localisation id(s)');
    }
    return found;
  }

  private async resolveActivitySectors(
    ids?: number[],
  ): Promise<ActivitySector[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const found = await this.activitySectorsRepository.findBy({ id: In(ids) });
    if (found.length !== ids.length) {
      throw new BadRequestException('Unknown activity sector id(s)');
    }
    return found;
  }

  private async hasValidRecruiter(recruiterId?: number): Promise<boolean> {
    if (!recruiterId) return false;
    return this.recruitersRepository.existsBy({ id: recruiterId });
  }

  async create(dto: CreateSeekerDto, requester?: Requester) {
    assertOwnerOrAdmin(requester, dto.userId);
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role !== UserRole.SEEKER) {
      throw new BadRequestException('User does not have the seeker role');
    }
    const alreadyLinked = await this.seekersRepository.existsBy({
      user: { id: user.id },
    });
    if (alreadyLinked) {
      throw new ConflictException('This user already has a seeker profile');
    }

    const [competences, localisations, activitySectors] = await Promise.all([
      this.resolveCompetences(dto.competenceIds),
      this.resolveLocalisations(dto.localisationIds),
      this.resolveActivitySectors(dto.activitySectorIds),
    ]);

    const hasVideo = Boolean(dto.video);
    if (hasVideo && !this.videoProviders.isLinkProviderEnabled()) {
      throw new ForbiddenException(
        'The link video provider is disabled; upload a file via POST /seekers/:id/video instead',
      );
    }
    const seeker = this.seekersRepository.create({
      name: dto.name,
      lastname: dto.lastname,
      video: dto.video ?? null,
      videoProvider: hasVideo ? 'link' : null,
      videoExternalId: hasVideo ? (dto.video ?? null) : null,
      videoStatus: VideoStatus.PENDING,
      videoConsentGivenAt: hasVideo ? new Date() : null,
      videoConsentVersion: hasVideo ? VIDEO_CONSENT_VERSION : null,
      user,
      competences,
      localisations,
      activitySectors,
    });
    return this.seekersRepository.save(seeker);
  }

  async findAll(query: FindSeekersQueryDto) {
    const { skip, take } = toSkipTake(query);
    const canSeeMinors = await this.hasValidRecruiter(query.recruiterId);

    const idQb = this.seekersRepository
      .createQueryBuilder('seeker')
      .select('seeker.id', 'id')
      .distinct(true);

    if (query.competenceIds?.length) {
      idQb.innerJoin(
        'seeker.competences',
        'fc',
        'fc.id IN (:...competenceIds)',
        { competenceIds: query.competenceIds },
      );
    }
    if (query.localisationIds?.length) {
      idQb.innerJoin(
        'seeker.localisations',
        'fl',
        'fl.id IN (:...localisationIds)',
        { localisationIds: query.localisationIds },
      );
    }
    if (query.activitySectorIds?.length) {
      idQb.innerJoin(
        'seeker.activitySectors',
        'fa',
        'fa.id IN (:...activitySectorIds)',
        { activitySectorIds: query.activitySectorIds },
      );
    }
    idQb.innerJoin('seeker.user', 'seekerUser');
    idQb.andWhere('seeker.certification = true');
    if (!canSeeMinors) {
      idQb.andWhere('seekerUser.birthDate <= :adultCutoff', {
        adultCutoff: adultCutoffDate(),
      });
    }
    if (query.search) {
      idQb.andWhere(
        '(seeker.name ILIKE :search OR seeker.lastname ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const total = await idQb.clone().getCount();
    const rows = await idQb
      .orderBy('seeker.id', 'ASC')
      .offset(skip)
      .limit(take)
      .getRawMany<{ id: number }>();
    const ids = rows.map((row) => row.id);

    if (ids.length === 0) {
      return paginate<Seeker>([], total, query);
    }

    const items = await this.seekersRepository.find({
      where: { id: In(ids) },
      relations: { ...SEEKER_RELATIONS, user: true },
      order: { id: 'ASC' },
    });

    const withVideoViews = await this.attachVideoView(
      items.map((item) => toPublicSeeker(item)),
    );
    return paginate(withVideoViews, total, query);
  }

  async findOne(id: number, recruiterId?: number, viewerId?: string) {
    const seeker = await this.seekersRepository.findOne({
      where: { id },
      relations: { ...SEEKER_RELATIONS, user: true },
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }

    const isOwner = Boolean(viewerId) && seeker.user.id === viewerId;
    if (!isOwner && seeker.user.birthDate && isMinor(seeker.user.birthDate)) {
      const canSeeMinors = await this.hasValidRecruiter(recruiterId);
      if (!canSeeMinors) {
        throw new NotFoundException('Seeker not found');
      }
    }

    const publicSeeker = toPublicSeeker(seeker, viewerId);
    const [withVideoView] = await this.attachVideoView([publicSeeker]);
    if (isOwner) {
      const [withLikeCount] = await this.attachLikeCounts([withVideoView]);
      return withLikeCount;
    }
    return withVideoView;
  }

  async findByUserId(userId: string) {
    const seeker = await this.seekersRepository.findOne({
      where: { user: { id: userId } },
      relations: { ...SEEKER_RELATIONS, user: true },
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }
    const [withVideoView] = await this.attachVideoView([seeker]);
    const [withLikeCount] = await this.attachLikeCounts([withVideoView]);
    return withLikeCount;
  }

  async findAllAdmin(query: FindSeekersAdminQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [items, total] = await this.seekersRepository.findAndCount({
      where: query.videoStatus ? { videoStatus: query.videoStatus } : {},
      relations: { ...SEEKER_RELATIONS, user: true },
      order: { id: 'DESC' },
      skip,
      take,
    });
    const withLikeCounts = await this.attachLikeCounts(items);
    return paginate(await this.attachVideoView(withLikeCounts), total, query);
  }

  async moderateVideo(id: number, dto: ModerateSeekerVideoDto) {
    const admin = await this.usersRepository.findOneBy({ id: dto.adminUserId });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('adminUserId does not belong to an admin');
    }
    if (dto.status === VideoStatus.REJECTED && !dto.reason) {
      throw new BadRequestException('A reason is required to reject a video');
    }

    const seeker = await this.seekersRepository.findOne({ where: { id } });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }

    seeker.videoStatus = dto.status;
    seeker.videoRejectionReason =
      dto.status === VideoStatus.REJECTED ? (dto.reason ?? null) : null;
    seeker.videoModeratedAt = new Date();
    seeker.videoModeratedBy = dto.adminUserId;

    return this.seekersRepository.save(seeker);
  }

  async update(id: number, dto: UpdateSeekerDto, requester?: Requester) {
    const seeker = await this.seekersRepository.findOne({
      where: { id },
      relations: { ...SEEKER_RELATIONS, user: true },
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }
    assertOwnerOrAdmin(requester, seeker.user.id);

    if (dto.name !== undefined) {
      seeker.name = dto.name;
    }
    if (dto.lastname !== undefined) {
      seeker.lastname = dto.lastname;
    }
    if (dto.competenceIds !== undefined) {
      seeker.competences = await this.resolveCompetences(dto.competenceIds);
    }
    if (dto.localisationIds !== undefined) {
      seeker.localisations = await this.resolveLocalisations(
        dto.localisationIds,
      );
    }
    if (dto.activitySectorIds !== undefined) {
      seeker.activitySectors = await this.resolveActivitySectors(
        dto.activitySectorIds,
      );
    }

    return this.seekersRepository.save(seeker);
  }

  async remove(id: number, requester?: Requester) {
    const seeker = await this.seekersRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }
    assertOwnerOrAdmin(requester, seeker.user.id);

    await this.deleteStoredVideo(seeker);
    await this.seekersRepository.delete(id);
  }

  private async deleteStoredVideo(seeker: {
    videoProvider: string | null;
    videoExternalId: string | null;
  }): Promise<void> {
    if (!seeker.videoProvider || !seeker.videoExternalId) return;
    const provider = this.videoProviders.get(
      seeker.videoProvider as VideoProviderName,
    );
    await provider.delete(seeker.videoExternalId);
  }

  async uploadVideo(
    id: number,
    file: StoredVideoFile,
    consentGiven: boolean,
    requester?: Requester,
  ) {
    const seeker = await this.seekersRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }
    assertOwnerOrAdmin(requester, seeker.user.id);
    if (!consentGiven) {
      throw new BadRequestException(
        'Le consentement à la publication de la vidéo (image et voix) est requis.',
      );
    }

    await this.deleteStoredVideo(seeker);

    const provider = this.videoProviders.getDefault();
    const { externalId } = await provider.store(file);

    seeker.video = null;
    seeker.videoProvider = provider.name;
    seeker.videoExternalId = externalId;
    seeker.videoStatus = VideoStatus.PENDING;
    seeker.videoRejectionReason = null;
    seeker.videoModeratedAt = null;
    seeker.videoModeratedBy = null;
    seeker.videoConsentGivenAt = new Date();
    seeker.videoConsentVersion = VIDEO_CONSENT_VERSION;

    return this.seekersRepository.save(seeker);
  }

  async deleteVideo(id: number, requester?: Requester) {
    const seeker = await this.seekersRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }
    assertOwnerOrAdmin(requester, seeker.user.id);

    await this.deleteStoredVideo(seeker);

    seeker.video = null;
    seeker.videoProvider = null;
    seeker.videoExternalId = null;
    seeker.videoStatus = VideoStatus.PENDING;
    seeker.videoRejectionReason = null;
    seeker.videoModeratedAt = null;
    seeker.videoModeratedBy = null;
    seeker.videoConsentGivenAt = null;
    seeker.videoConsentVersion = null;

    return this.seekersRepository.save(seeker);
  }

  async resolveLocalVideoFileAccess(
    id: number,
    viewerId?: string,
  ): Promise<{ seeker: Seeker } | null> {
    const seeker = await this.seekersRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!seeker || seeker.videoProvider !== 'local' || !seeker.videoExternalId) {
      return null;
    }
    const isOwner = Boolean(viewerId) && seeker.user.id === viewerId;
    if (isOwner) return { seeker };

    if (viewerId) {
      const viewer = await this.usersRepository.findOneBy({ id: viewerId });
      if (viewer?.role === UserRole.ADMIN) return { seeker };
    }

    const minor = seeker.user.birthDate ? isMinor(seeker.user.birthDate) : false;
    const allowed = !minor && seeker.videoStatus === VideoStatus.APPROVED;
    return allowed ? { seeker } : null;
  }
}
