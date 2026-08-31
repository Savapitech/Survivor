import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Recruiter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyName: string;

  @Column()
  localisation: string;
}
