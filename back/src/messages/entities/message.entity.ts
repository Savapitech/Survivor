import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Recruiter } from '../../recruiters/entities/recruiter.entity';
import { Seeker } from '../../seekers/entities/seeker.entity';

export enum MessageSenderRole {
  SEEKER = 'seeker',
  RECRUITER = 'recruiter',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recruiter, { onDelete: 'CASCADE' })
  recruiter: Recruiter;

  @ManyToOne(() => Seeker, { onDelete: 'CASCADE' })
  seeker: Seeker;

  @Column({ type: 'enum', enum: MessageSenderRole })
  senderRole: MessageSenderRole;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  seenAt: Date | null;
}
