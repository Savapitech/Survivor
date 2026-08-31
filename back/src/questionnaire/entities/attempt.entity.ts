import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Seeker)
  @JoinColumn()
  seeker: Seeker;

  @Column({ type: 'float', nullable: true })
  score: number | null;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date | null;
}
