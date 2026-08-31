import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';

@Entity()
export class Competence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  competence: string;

  @ManyToOne(() => Seeker, (seeker) => seeker.competences)
  seeker: Seeker;
}
