import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';

@Entity()
export class ActivitySector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  activitySector: string;

  @ManyToMany(() => Seeker, (seeker) => seeker.activitySectors)
  seekers: Seeker[];
}
