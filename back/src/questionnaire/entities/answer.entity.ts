import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Attempt } from './attempt.entity';
import { Question } from './question.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attempt)
  attempt: Attempt;

  @ManyToOne(() => Question)
  question: Question;

  @Column({ type: 'float' })
  value: number;
}
