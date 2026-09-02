import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recruiter } from './entities/recruiter.entity';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { PaginationQueryDto, paginate, toSkipTake } from '../common/pagination';

@Injectable()
export class RecruitersService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruitersRepository: Repository<Recruiter>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateRecruiterDto) {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role !== UserRole.RECRUITER) {
      throw new BadRequestException('User does not have the recruiter role');
    }
    const alreadyLinked = await this.recruitersRepository.existsBy({
      user: { id: user.id },
    });
    if (alreadyLinked) {
      throw new ConflictException('This user already has a recruiter profile');
    }

    const recruiter = this.recruitersRepository.create({
      companyName: dto.companyName,
      user,
    });
    return this.recruitersRepository.save(recruiter);
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [items, total] = await this.recruitersRepository.findAndCount({
      skip,
      take,
      order: { id: 'ASC' },
    });
    return paginate(items, total, query);
  }

  async findOne(id: number) {
    const recruiter = await this.recruitersRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    return recruiter;
  }

  async findByUserId(userId: string) {
    const recruiter = await this.recruitersRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    return recruiter;
  }

  async update(id: number, dto: UpdateRecruiterDto) {
    await this.findOne(id);
    await this.recruitersRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.recruitersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Recruiter not found');
    }
  }
}
