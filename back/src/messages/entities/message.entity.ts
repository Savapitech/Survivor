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

export enum MessageSenderRole {
  SEEKER = 'seeker',
  RECRUITER = 'recruiter',
}

@Entity()
export class Message {
  @ApiProperty({
    description: "message's id",
    example: '1',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'recuiter in the conversation',
    type: Recruiter,
  })
  @ManyToOne(() => Recruiter, { onDelete: 'CASCADE' })
  recruiter: Recruiter;

  @ApiProperty({
    description: 'seeker in the conversation',
    type: Seeker,
  })
  @ManyToOne(() => Seeker, { onDelete: 'CASCADE' })
  seeker: Seeker;

  @ApiProperty({
    description: 'who send the message',
    enum: MessageSenderRole,
    example: MessageSenderRole.RECRUITER,
  })
  @Column({ type: 'enum', enum: MessageSenderRole })
  senderRole: MessageSenderRole;

  @ApiProperty({
    description: "message's content",
    type: String,
    example: 'Hello, I would like to discuss your profile.',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({
    description: "message's date",
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: "message's date seen",
    type: Date,
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  seenAt: Date | null;
}
