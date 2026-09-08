import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Recruiter } from '../../recruiters/entities/recruiter.entity';
import { Seeker } from '../../seekers/entities/seeker.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum InteractionType {
  VIEW = 'view',
  CONTACT = 'contact',
  FAVORITE = 'favorite',
}

@Entity()
export class Interaction {
  @ApiProperty({
    description: "interaction's id",
    example: '1',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "competence's type",
    enum: InteractionType,
    example: InteractionType.FAVORITE,
  })
  @Column({ type: 'enum', enum: InteractionType })
  type: InteractionType;

  @ApiProperty({
    description: 'List of recuiter who have this interaction',
    type: [Recruiter],
  })
  @ManyToOne(() => Recruiter, { onDelete: 'CASCADE' })
  recruiter: Recruiter;

  @ApiProperty({
    description: 'List of seeker who have this interaction',
    type: [Seeker],
  })
  @ManyToOne(() => Seeker, { onDelete: 'CASCADE' })
  seeker: Seeker;

  @ApiProperty({
    description: "Interaction's date",
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: "Interaction's view",
    nullable: true,
    type: Date,
  })
  @Column({ type: 'timestamp', nullable: true })
  seenAt: Date | null;
}
