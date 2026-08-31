import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';

@Entity()
export class Localisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  localisation: string;

  @ManyToMany(() => Seeker, (seeker) => seeker.localisations)
  seekers: Seeker[];
}
