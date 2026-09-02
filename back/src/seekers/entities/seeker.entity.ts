import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Localisation } from '../../localisations/entities/localisation.entity';
import { Competence } from '../../competences/entities/competence.entity';
import { ActivitySector } from '../../activity-sectors/entities/activity-sector.entity';

export enum VideoStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

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

  @Column({ type: 'enum', enum: VideoStatus, default: VideoStatus.PENDING })
  videoStatus: VideoStatus;

  @Column({ type: 'text', nullable: true })
  videoRejectionReason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  videoModeratedAt: Date | null;

  @Column({ type: 'uuid', nullable: true })
  videoModeratedBy: string | null;

  @ManyToMany(() => Localisation, (localisation) => localisation.seekers)
  @JoinTable()
  localisations: Localisation[];

  @ManyToMany(() => Competence, (competence) => competence.seekers)
  @JoinTable()
  competences: Competence[];

  @ManyToMany(() => ActivitySector, (activitySector) => activitySector.seekers)
  @JoinTable()
  activitySectors: ActivitySector[];

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
