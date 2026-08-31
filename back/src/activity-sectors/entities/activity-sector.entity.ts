import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';

@Entity()
export class ActivitySector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  activitySector: string;

  @ManyToOne(() => Seeker, (seeker) => seeker.activitySectors)
  seeker: Seeker;
}
