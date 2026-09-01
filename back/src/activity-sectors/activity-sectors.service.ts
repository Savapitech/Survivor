import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ActivitySector } from './entities/activity-sector.entity';
import { CreateActivitySectorDto } from './dto/create-activity-sector.dto';
import { UpdateActivitySectorDto } from './dto/update-activity-sector.dto';
import { PaginationQueryDto, paginate, toSkipTake } from '../common/pagination';

const FOREIGN_KEY_VIOLATION = '23503';

@Injectable()
export class ActivitySectorsService {
  constructor(
    @InjectRepository(ActivitySector)
    private readonly activitySectorsRepository: Repository<ActivitySector>,
  ) {}

  async create(dto: CreateActivitySectorDto) {
    const existing = await this.activitySectorsRepository.existsBy({
      activitySector: dto.activitySector,
    });
    if (existing) {
      throw new ConflictException('Activity sector already exists');
    }
    return this.activitySectorsRepository.save(
      this.activitySectorsRepository.create(dto),
    );
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [items, total] = await this.activitySectorsRepository.findAndCount({
      skip,
      take,
      order: { activitySector: 'ASC' },
    });
    return paginate(items, total, query);
  }

  async findOne(id: number) {
    const activitySector = await this.activitySectorsRepository.findOneBy({ id });
    if (!activitySector) {
      throw new NotFoundException('Activity sector not found');
    }
    return activitySector;
  }

  async update(id: number, dto: UpdateActivitySectorDto) {
    const activitySector = await this.findOne(id);
    if (dto.activitySector && dto.activitySector !== activitySector.activitySector) {
      const existing = await this.activitySectorsRepository.existsBy({
        activitySector: dto.activitySector,
      });
      if (existing) {
        throw new ConflictException('Activity sector already exists');
      }
    }
    await this.activitySectorsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.activitySectorsRepository
      .delete(id)
      .catch((err) => {
        if (
          err instanceof QueryFailedError &&
          (err as { code?: string }).code === FOREIGN_KEY_VIOLATION
        ) {
          throw new ConflictException(
            'Activity sector is still referenced by seekers',
          );
        }
        throw err;
      });
    if (!result.affected) {
      throw new NotFoundException('Activity sector not found');
    }
  }
}
