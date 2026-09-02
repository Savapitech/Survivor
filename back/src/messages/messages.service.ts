import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Message, MessageSenderRole } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindThreadQueryDto } from './dto/find-thread-query.dto';
import { MarkThreadSeenDto } from './dto/mark-thread-seen.dto';
import { Recruiter } from '../recruiters/entities/recruiter.entity';
import { Seeker } from '../seekers/entities/seeker.entity';
import { paginate, toSkipTake } from '../common/pagination';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Recruiter)
    private readonly recruitersRepository: Repository<Recruiter>,
    @InjectRepository(Seeker)
    private readonly seekersRepository: Repository<Seeker>,
  ) {}

  async create(dto: CreateMessageDto) {
    const recruiter = await this.recruitersRepository.findOneBy({
      id: dto.recruiterId,
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    const seeker = await this.seekersRepository.findOneBy({
      id: dto.seekerId,
    });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }

    const message = this.messagesRepository.create({
      recruiter,
      seeker,
      senderRole: dto.senderRole,
      content: dto.content,
      seenAt: null,
    });
    const saved = await this.messagesRepository.save(message);
    return this.toMessagePreview(saved);
  }

  async findThread(query: FindThreadQueryDto) {
    const { skip, take } = toSkipTake(query);
    const [items, total] = await this.messagesRepository.findAndCount({
      where: {
        recruiter: { id: query.recruiterId },
        seeker: { id: query.seekerId },
      },
      order: { createdAt: 'ASC' },
      skip,
      take,
    });
    return paginate(
      items.map((m) => this.toMessagePreview(m)),
      total,
      query,
    );
  }

  async conversationsForRecruiter(recruiterId: number) {
    const recruiter = await this.recruitersRepository.findOneBy({
      id: recruiterId,
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    const messages = await this.messagesRepository.find({
      where: { recruiter: { id: recruiterId } },
      relations: { seeker: true },
      order: { createdAt: 'DESC' },
    });

    return this.groupConversations(
      messages,
      (m) => m.seeker,
      MessageSenderRole.SEEKER,
    ).map(({ other, lastMessage, unreadCount }) => ({
      seeker: this.toSeekerSummary(other),
      lastMessage: this.toMessagePreview(lastMessage),
      unreadCount,
    }));
  }

  async conversationsForSeeker(seekerId: number) {
    const seeker = await this.seekersRepository.findOneBy({ id: seekerId });
    if (!seeker) {
      throw new NotFoundException('Seeker not found');
    }

    const messages = await this.messagesRepository.find({
      where: { seeker: { id: seekerId } },
      relations: { recruiter: true },
      order: { createdAt: 'DESC' },
    });

    return this.groupConversations(
      messages,
      (m) => m.recruiter,
      MessageSenderRole.RECRUITER,
    ).map(({ other, lastMessage, unreadCount }) => ({
      recruiter: other,
      lastMessage: this.toMessagePreview(lastMessage),
      unreadCount,
    }));
  }

  private toMessagePreview(message: Message) {
    const { id, senderRole, content, createdAt, seenAt } = message;
    return { id, senderRole, content, createdAt, seenAt };
  }

  private toSeekerSummary(seeker: Seeker) {
    const { id, name, lastname, certification } = seeker;
    return { id, name, lastname, certification };
  }

  private groupConversations<T extends { id: number }>(
    messages: Message[],
    getOther: (m: Message) => T,
    unreadSenderRole: MessageSenderRole,
  ) {
    const byOther = new Map<
      number,
      { other: T; lastMessage: Message; unreadCount: number }
    >();

    for (const message of messages) {
      const other = getOther(message);
      let entry = byOther.get(other.id);
      if (!entry) {
        entry = { other, lastMessage: message, unreadCount: 0 };
        byOther.set(other.id, entry);
      }
      if (message.senderRole === unreadSenderRole && !message.seenAt) {
        entry.unreadCount += 1;
      }
    }

    return Array.from(byOther.values()).sort(
      (a, b) =>
        b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime(),
    );
  }

  async markThreadSeen(dto: MarkThreadSeenDto) {
    const senderRoleToMark =
      dto.viewerRole === MessageSenderRole.SEEKER
        ? MessageSenderRole.RECRUITER
        : MessageSenderRole.SEEKER;

    const result = await this.messagesRepository.update(
      {
        recruiter: { id: dto.recruiterId },
        seeker: { id: dto.seekerId },
        senderRole: senderRoleToMark,
        seenAt: IsNull(),
      },
      { seenAt: new Date() },
    );

    return { updated: result.affected ?? 0 };
  }
}
