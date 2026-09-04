import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto, paginate, toSkipTake } from '../common/pagination';

const SALT_ROUNDS = 10;

interface Requester {
  userId?: string;
  role?: UserRole;
}

function assertSelfOrAdmin(requester: Requester | undefined, targetId: string) {
  if (requester?.role === UserRole.ADMIN) return;
  if (requester?.userId === targetId) return;
  throw new ForbiddenException('This account does not belong to you');
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  private toPublicUser(user: User) {
    const { password, ...publicUser } = user;
    return publicUser;
  }

  async create(dto: CreateUserDto, requester?: Requester) {
    if (dto.role === UserRole.ADMIN && requester?.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Creating an admin account requires being authenticated as an admin',
      );
    }

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

  async findOne(id: string, requester?: Requester) {
    if (requester !== undefined) {
      assertSelfOrAdmin(requester, id);
    }
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toPublicUser(user);
  }

  async findOneAll(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto, requester?: Requester) {
    assertSelfOrAdmin(requester, id);
    if (dto.role !== undefined && requester?.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Changing an account role requires being authenticated as an admin',
      );
    }
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

  async remove(id: string, requester?: Requester) {
    assertSelfOrAdmin(requester, id);
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
