import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Attempt } from './attempt.entity';
import { Question } from './question.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['attempt', 'question'])
export class Answer {
  @ApiProperty({
    description: "answer's id",
    example: '1',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'atttempt',
    type: Attempt,
  })
  @ManyToOne(() => Attempt, { onDelete: 'CASCADE' })
  attempt: Attempt;

  @ApiProperty({
    description: 'question',
    type: Question,
  })
  @ManyToOne(() => Question, { onDelete: 'RESTRICT' })
  question: Question;

  @ApiProperty({
    description: 'value',
    example: 0,
  })
  @Column({ type: 'float' })
  value: number;
}
