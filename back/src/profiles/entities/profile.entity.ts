import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Seeker } from '../../seekers/entities/seeker.entity';
import { Recruiter } from '../../recruiters/entities/recruiter.entity';

export enum ProfileType {
  SEEKER = 'seeker',
  RECRUITER = 'recruiter',
}

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: ProfileType })
  type: ProfileType;

  @OneToOne(() => Seeker, { nullable: true })
  @JoinColumn()
  seeker: Seeker | null;

  @OneToOne(() => Recruiter, { nullable: true })
  @JoinColumn()
  recruiter: Recruiter | null;
}
