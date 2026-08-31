import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  @OneToMany(() => Localisation, (localisation) => localisation.seeker)
  localisations: Localisation[];

  @OneToMany(() => Competence, (competence) => competence.seeker)
  competences: Competence[];

  @OneToMany(() => ActivitySector, (activitySector) => activitySector.seeker)
  activitySectors: ActivitySector[];
}
