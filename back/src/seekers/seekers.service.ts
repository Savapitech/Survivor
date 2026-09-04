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
  ) {}

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
    const seeker = this.seekersRepository.create({
      name: dto.name,
      lastname: dto.lastname,
      video: dto.video ?? null,
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

    return paginate(
      items.map((item) => toPublicSeeker(item)),
      total,
      query,
    );
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
    if (isOwner) {
      const [withLikeCount] = await this.attachLikeCounts([publicSeeker]);
      return withLikeCount;
    }
    return publicSeeker;
  }

  async findByUserId(userId: string) {
    const seeker = await this.seekersRepository.findOne({
      where: { user: { id: userId } },
      relations: { ...SEEKER_RELATIONS, user: true },
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }
    const [withLikeCount] = await this.attachLikeCounts([seeker]);
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
    return paginate(await this.attachLikeCounts(items), total, query);
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
    if (dto.video !== undefined && dto.video !== seeker.video) {
      seeker.video = dto.video;
      seeker.videoStatus = VideoStatus.PENDING;
      seeker.videoRejectionReason = null;
      seeker.videoModeratedAt = null;
      seeker.videoModeratedBy = null;
      // La révocation (video === null) efface aussi le consentement enregistré :
      // il ne doit pas survivre à la suppression du lien qu'il couvrait.
      seeker.videoConsentGivenAt = dto.video ? new Date() : null;
      seeker.videoConsentVersion = dto.video ? VIDEO_CONSENT_VERSION : null;
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

    await this.seekersRepository.delete(id);
  }
}
