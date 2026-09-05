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
import { ApiProperty } from '@nestjs/swagger';

export enum VideoStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class Seeker {
  @ApiProperty({
    description: "Seeker's id",
    example: "2"
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "Seeker's name",
    example: "Jean-Charle"
  })
  @Column()
  name: string;

  @ApiProperty({
    description: "Lastname",
    example: "Fontaine"
  })
  @Column()
  lastname: string;

  @ApiProperty({
    description: "Certification",
    type: Boolean,
    example: true
  })
  @Column({ default: false })
  certification: boolean;

  @ApiProperty({
    description: "Video's link",
    example: "youtube.com/watch?v=dQw4w9WgXcQ"
  })
  @Column({ type: 'varchar', nullable: true })
  video: string | null;

  @ApiProperty({
    description: "Video's status",
    enum: VideoStatus,
    example: VideoStatus.PENDING
  })
  @Column({ type: 'enum', enum: VideoStatus, default: VideoStatus.PENDING })
  videoStatus: VideoStatus;

  @ApiProperty({
    description: "Video's rejection reason",
    example: "Your video isn't professional."
  })
  @Column({ type: 'text', nullable: true })
  videoRejectionReason: string | null;

  @ApiProperty({
    description: "Video's rejection reason",
    type: Date
  })
  @Column({ type: 'timestamp', nullable: true })
  videoModeratedAt: Date | null;

  @ApiProperty({
    description: "Video's moderator's name",
    example: "Admin_1"
  })
  @Column({ type: 'uuid', nullable: true })
  videoModeratedBy: string | null;

  @ApiProperty({
    description: "Consent public video date",
    type: Date,
  })
  @Column({ type: 'timestamp', nullable: true })
  videoConsentGivenAt: Date | null;

  @ApiProperty({
    description: "Consent public video version",
    type: String,
  })
  @Column({ type: 'varchar', nullable: true })
  videoConsentVersion: string | null;

  @ApiProperty({
    description: "Seeker's localisations",
    type: [Localisation],
  })
  @ManyToMany(() => Localisation, (localisation) => localisation.seekers)
  @JoinTable()
  localisations: Localisation[];

  @ApiProperty({
    description: "Seeker's competences",
    type: [Competence],
  })
  @ManyToMany(() => Competence, (competence) => competence.seekers)
  @JoinTable()
  competences: Competence[];

  @ApiProperty({
    description: "Seeker's activity sectors",
    type: [ActivitySector],
  })
  @ManyToMany(() => ActivitySector, (activitySector) => activitySector.seekers)
  @JoinTable()
  activitySectors: ActivitySector[];

  @ApiProperty({
    description: "Seeker's user",
    type: User,
  })
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
