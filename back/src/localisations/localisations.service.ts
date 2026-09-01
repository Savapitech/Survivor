import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Localisation } from './entities/localisation.entity';
import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { UpdateLocalisationDto } from './dto/update-localisation.dto';
import { PaginationQueryDto, paginate, toSkipTake } from '../common/pagination';

const FOREIGN_KEY_VIOLATION = '23503';

@Injectable()
export class LocalisationsService {
  constructor(
    @InjectRepository(Localisation)
    private readonly localisationsRepository: Repository<Localisation>,
  ) {}

  async create(dto: CreateLocalisationDto) {
    const existing = await this.localisationsRepository.existsBy({
      localisation: dto.localisation,
    });
    if (existing) {
      throw new ConflictException('Localisation already exists');
    }
    return this.localisationsRepository.save(
      this.localisationsRepository.create(dto),
    );
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [items, total] = await this.localisationsRepository.findAndCount({
      skip,
      take,
      order: { localisation: 'ASC' },
    });
    return paginate(items, total, query);
  }

  async findOne(id: number) {
    const localisation = await this.localisationsRepository.findOneBy({ id });
    if (!localisation) {
      throw new NotFoundException('Localisation not found');
    }
    return localisation;
  }

  async update(id: number, dto: UpdateLocalisationDto) {
    const localisation = await this.findOne(id);
    if (dto.localisation && dto.localisation !== localisation.localisation) {
      const existing = await this.localisationsRepository.existsBy({
        localisation: dto.localisation,
      });
      if (existing) {
        throw new ConflictException('Localisation already exists');
      }
    }
    await this.localisationsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.localisationsRepository
      .delete(id)
      .catch((err) => {
        if (
          err instanceof QueryFailedError &&
          (err as { code?: string }).code === FOREIGN_KEY_VIOLATION
        ) {
          throw new ConflictException(
            'Localisation is still referenced by seekers',
          );
        }
        throw err;
      });
    if (!result.affected) {
      throw new NotFoundException('Localisation not found');
    }
  }
}
