import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Localisation } from '../../localisations/entities/localisation.entity';
import { Competence } from '../../competences/entities/competence.entity';
import { ActivitySector } from '../../activity-sectors/entities/activity-sector.entity';

@Entity()
export class Seeker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ default: false })
  certification: boolean;

  @Column({ type: 'varchar', nullable: true })
  video: string | null;

  @ManyToMany(() => Localisation, (localisation) => localisation.seekers)
  @JoinTable()
  localisations: Localisation[];

  @ManyToMany(() => Competence, (competence) => competence.seekers)
  @JoinTable()
  competences: Competence[];

  @ManyToMany(() => ActivitySector, (activitySector) => activitySector.seekers)
  @JoinTable()
  activitySectors: ActivitySector[];
}
