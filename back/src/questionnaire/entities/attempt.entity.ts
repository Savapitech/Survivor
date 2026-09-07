import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Attempt {
  @ApiProperty({
    description: "attempt's id",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "attempt's seeker",
    type: Seeker,
  })
  @OneToOne(() => Seeker, { onDelete: 'CASCADE' })
  @JoinColumn()
  seeker: Seeker;

  @ApiProperty({
    description: "attempt's question's id",
    type: [Number],
    examples: [1, 2, 3],
  })
  @Column({ type: 'int', array: true, default: () => "'{}'" })
  questionIds: number[];

  @ApiProperty({
    description: "atttempt's score",
    type: Number,
    example: 100,
  })
  @Column({ type: 'float', nullable: true })
  score: number | null;

  @ApiProperty({
    description: "atttempt's submitted date",
    type: Date,
  })
  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date | null;
}
