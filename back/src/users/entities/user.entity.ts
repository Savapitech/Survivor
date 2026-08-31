import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';

export enum UserRole {
  ADMIN = 'admin',
  SEEKER = 'seeker',
  RECRUITER = 'recruiter',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
