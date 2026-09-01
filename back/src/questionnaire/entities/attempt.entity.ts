import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Seeker, { onDelete: 'CASCADE' })
  @JoinColumn()
  seeker: Seeker;

  @Column({ type: 'int', array: true, default: () => "'{}'" })
  questionIds: number[];

  @Column({ type: 'float', nullable: true })
  score: number | null;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date | null;
}
