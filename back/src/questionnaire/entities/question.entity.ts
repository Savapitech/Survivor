import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ type: 'float', default: 1 })
  weight: number;

  @Column({ default: true })
  active: boolean;
}
