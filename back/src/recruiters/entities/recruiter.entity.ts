import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Recruiter {
  @ApiProperty({
    description: 'id',
    example: '1',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'companyName',
    example: 'fake company',
    required: true,
  })
  @Column()
  companyName: string;

  @ApiProperty({
    description: 'user',
    type: User,
    required: true,
  })
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
