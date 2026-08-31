import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';

@Entity()
export class Localisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  localisation: string;

  @ManyToOne(() => Seeker, (seeker) => seeker.localisations)
  seeker: Seeker;
}
