import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Seeker } from '../../seekers/entities/seeker.entity';
import { Recruiter } from '../../recruiters/entities/recruiter.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Seeker, { nullable: true })
  @JoinColumn()
  seeker: Seeker | null;

  @OneToOne(() => Recruiter, { nullable: true })
  @JoinColumn()
  recruiter: Recruiter | null;
}
