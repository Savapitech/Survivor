import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Attempt } from './attempt.entity';
import { Question } from './question.entity';

@Entity()
@Unique(['attempt', 'question'])
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attempt, { onDelete: 'CASCADE' })
  attempt: Attempt;

  @ManyToOne(() => Question, { onDelete: 'RESTRICT' })
  question: Question;

  @Column({ type: 'float' })
  value: number;
}
