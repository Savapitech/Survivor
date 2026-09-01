import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';

@Entity()
export class Competence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  competence: string;

  @ManyToMany(() => Seeker, (seeker) => seeker.competences)
  seekers: Seeker[];
}
