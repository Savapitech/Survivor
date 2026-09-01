import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Competence } from './entities/competence.entity';
import { CreateCompetenceDto } from './dto/create-competence.dto';
import { UpdateCompetenceDto } from './dto/update-competence.dto';
import { PaginationQueryDto, paginate, toSkipTake } from '../common/pagination';

const FOREIGN_KEY_VIOLATION = '23503';

@Injectable()
export class CompetencesService {
  constructor(
    @InjectRepository(Competence)
    private readonly competencesRepository: Repository<Competence>,
  ) {}

  async create(dto: CreateCompetenceDto) {
    const existing = await this.competencesRepository.existsBy({
      competence: dto.competence,
    });
    if (existing) {
      throw new ConflictException('Competence already exists');
    }
    return this.competencesRepository.save(
      this.competencesRepository.create(dto),
    );
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [items, total] = await this.competencesRepository.findAndCount({
      skip,
      take,
      order: { competence: 'ASC' },
    });
    return paginate(items, total, query);
  }

  async findOne(id: number) {
    const competence = await this.competencesRepository.findOneBy({ id });
    if (!competence) {
      throw new NotFoundException('Competence not found');
    }
    return competence;
  }

  async update(id: number, dto: UpdateCompetenceDto) {
    const competence = await this.findOne(id);
    if (dto.competence && dto.competence !== competence.competence) {
      const existing = await this.competencesRepository.existsBy({
        competence: dto.competence,
      });
      if (existing) {
        throw new ConflictException('Competence already exists');
      }
    }
    await this.competencesRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.competencesRepository.delete(id).catch((err) => {
      if (
        err instanceof QueryFailedError &&
        (err as { code?: string }).code === FOREIGN_KEY_VIOLATION
      ) {
        throw new ConflictException(
          'Competence is still referenced by seekers',
        );
      }
      throw err;
    });
    if (!result.affected) {
      throw new NotFoundException('Competence not found');
    }
  }
}
