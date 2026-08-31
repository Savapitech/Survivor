import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Recruiter } from '../../recruiters/entities/recruiter.entity';
import { Seeker } from '../../seekers/entities/seeker.entity';

export enum InteractionType {
  VIEW = 'view',
  CONTACT = 'contact',
  FAVORITE = 'favorite',
}

@Entity()
export class Interaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: InteractionType })
  type: InteractionType;

  @ManyToOne(() => Recruiter)
  recruiter: Recruiter;

  @ManyToOne(() => Seeker)
  seeker: Seeker;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  seenAt: Date | null;
}
