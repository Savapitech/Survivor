import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Seeker } from './entities/seeker.entity';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { FindSeekersQueryDto } from './dto/find-seekers-query.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Competence } from '../competences/entities/competence.entity';
import { Localisation } from '../localisations/entities/localisation.entity';
import { ActivitySector } from '../activity-sectors/entities/activity-sector.entity';
import { paginate, toSkipTake } from '../common/pagination';

const SEEKER_RELATIONS = {
  competences: true,
  localisations: true,
  activitySectors: true,
} as const;

@Injectable()
export class SeekersService {
  constructor(
    @InjectRepository(Seeker) private readonly seekersRepository: Repository<Seeker>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Competence)
    private readonly competencesRepository: Repository<Competence>,
    @InjectRepository(Localisation)
    private readonly localisationsRepository: Repository<Localisation>,
    @InjectRepository(ActivitySector)
    private readonly activitySectorsRepository: Repository<ActivitySector>,
  ) {}

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

  private async resolveActivitySectors(ids?: number[]): Promise<ActivitySector[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const found = await this.activitySectorsRepository.findBy({ id: In(ids) });
    if (found.length !== ids.length) {
      throw new BadRequestException('Unknown activity sector id(s)');
    }
    return found;
  }

  async create(dto: CreateSeekerDto) {
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

    const seeker = this.seekersRepository.create({
      name: dto.name,
      lastname: dto.lastname,
      video: dto.video ?? null,
      user,
      competences,
      localisations,
      activitySectors,
    });
    return this.seekersRepository.save(seeker);
  }

  async findAll(query: FindSeekersQueryDto) {
    const { skip, take } = toSkipTake(query);

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
    if (query.certification !== undefined) {
      idQb.andWhere('seeker.certification = :certification', {
        certification: query.certification,
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
      relations: SEEKER_RELATIONS,
      order: { id: 'ASC' },
    });

    return paginate(items, total, query);
  }

  async findOne(id: number) {
    const seeker = await this.seekersRepository.findOne({
      where: { id },
      relations: { ...SEEKER_RELATIONS, user: true },
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }
    return seeker;
  }

  async update(id: number, dto: UpdateSeekerDto) {
    const seeker = await this.seekersRepository.findOne({
      where: { id },
      relations: SEEKER_RELATIONS,
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }

    if (dto.name !== undefined) {
      seeker.name = dto.name;
    }
    if (dto.lastname !== undefined) {
      seeker.lastname = dto.lastname;
    }
    if (dto.video !== undefined) {
      seeker.video = dto.video;
    }
    if (dto.competenceIds !== undefined) {
      seeker.competences = await this.resolveCompetences(dto.competenceIds);
    }
    if (dto.localisationIds !== undefined) {
      seeker.localisations = await this.resolveLocalisations(dto.localisationIds);
    }
    if (dto.activitySectorIds !== undefined) {
      seeker.activitySectors = await this.resolveActivitySectors(
        dto.activitySectorIds,
      );
    }

    return this.seekersRepository.save(seeker);
  }

  async remove(id: number) {
    const result = await this.seekersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Seeker not found');
    }
  }
}
