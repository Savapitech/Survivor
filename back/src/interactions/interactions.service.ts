import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Interaction, InteractionType } from './entities/interaction.entity';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { FindInteractionsQueryDto } from './dto/find-interactions-query.dto';
import { Recruiter } from '../recruiters/entities/recruiter.entity';
import { Seeker } from '../seekers/entities/seeker.entity';
import { paginate, toSkipTake } from '../common/pagination';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(Interaction)
    private readonly interactionsRepository: Repository<Interaction>,
    @InjectRepository(Recruiter)
    private readonly recruitersRepository: Repository<Recruiter>,
    @InjectRepository(Seeker)
    private readonly seekersRepository: Repository<Seeker>,
  ) {}

  async create(dto: CreateInteractionDto) {
    const recruiter = await this.recruitersRepository.findOneBy({
      id: dto.recruiterId,
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    const seeker = await this.seekersRepository.findOneBy({ id: dto.seekerId });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }

    if (
      dto.type === InteractionType.FAVORITE ||
      dto.type === InteractionType.LIKE
    ) {
      const existing = await this.interactionsRepository.findOne({
        where: {
          type: dto.type,
          recruiter: { id: recruiter.id },
          seeker: { id: seeker.id },
        },
      });
      if (existing) {
        return existing;
      }
    }

    const interaction = this.interactionsRepository.create({
      type: dto.type,
      recruiter,
      seeker,
      seenAt: null,
    });
    return this.interactionsRepository.save(interaction);
  }

  async findSent(recruiterId: number, query: FindInteractionsQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [items, total] = await this.interactionsRepository.findAndCount({
      where: {
        recruiter: { id: recruiterId },
        ...(query.type && { type: query.type }),
      },
      relations: { seeker: true },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
    return paginate(items, total, query);
  }

  async findReceived(seekerId: number, query: FindInteractionsQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [items, total] = await this.interactionsRepository.findAndCount({
      where: {
        seeker: { id: seekerId },
        ...(query.type && { type: query.type }),
        ...(query.unreadOnly && { seenAt: IsNull() }),
      },
      relations: { recruiter: true },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
    return paginate(items, total, query);
  }

  async countUnread(seekerId: number) {
    const unread = await this.interactionsRepository.countBy({
      seeker: { id: seekerId },
      seenAt: IsNull(),
    });
    return { unread };
  }

  async findOne(id: number) {
    const interaction = await this.interactionsRepository.findOne({
      where: { id },
      relations: { recruiter: true, seeker: true },
    });
    if (!interaction) {
      throw new NotFoundException('Interaction not found');
    }
    return interaction;
  }

  async markSeen(id: number, seekerId: number) {
    const interaction = await this.findOne(id);
    if (interaction.seeker.id !== seekerId) {
      throw new ForbiddenException('This interaction does not belong to you');
    }
    if (!interaction.seenAt) {
      interaction.seenAt = new Date();
      await this.interactionsRepository.save(interaction);
    }
    return interaction;
  }

  async markAllSeen(seekerId: number) {
    const result = await this.interactionsRepository.update(
      { seeker: { id: seekerId }, seenAt: IsNull() },
      { seenAt: new Date() },
    );
    return { updated: result.affected ?? 0 };
  }

  async removeFavorite(recruiterId: number, seekerId: number) {
    const result = await this.interactionsRepository.delete({
      recruiter: { id: recruiterId },
      seeker: { id: seekerId },
      type: InteractionType.FAVORITE,
    });
    if (!result.affected) {
      throw new NotFoundException('Favorite not found');
    }
  }

  async removeLike(recruiterId: number, seekerId: number) {
    const result = await this.interactionsRepository.delete({
      recruiter: { id: recruiterId },
      seeker: { id: seekerId },
      type: InteractionType.LIKE,
    });
    if (!result.affected) {
      throw new NotFoundException('Like not found');
    }
  }

  async remove(id: number) {
    const result = await this.interactionsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Interaction not found');
    }
  }
}
