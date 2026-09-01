import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto, paginate, toSkipTake } from '../common/pagination';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  private toPublicUser(user: User) {
    const { password, ...publicUser } = user;
    return publicUser;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersRepository.save(
      this.usersRepository.create({ ...dto, password }),
    );
    return this.toPublicUser(user);
  }

  async findAll(query: PaginationQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [users, total] = await this.usersRepository.findAndCount({
      skip,
      take,
      order: { email: 'ASC' },
    });
    return paginate(
      users.map((user) => this.toPublicUser(user)),
      total,
      query,
    );
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toPublicUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const emailTaken = await this.usersRepository.existsBy({
        email: dto.email,
      });
      if (emailTaken) {
        throw new ConflictException('Email already in use');
      }
    }

    const patch = { ...dto };
    if (patch.password) {
      patch.password = await bcrypt.hash(patch.password, SALT_ROUNDS);
    }

    await this.usersRepository.update(id, patch);
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.usersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }
}
