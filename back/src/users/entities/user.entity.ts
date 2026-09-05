import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  SEEKER = 'seeker',
  RECRUITER = 'recruiter',
}

@Entity()
export class User {
  @ApiProperty({
    description: "user's id",
    example: "93d5728f-165a-4526-a6d2-00a595dd1e12"
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: "user's email",
    example: "fake.email@extension.com"
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: "user's password",
    example: "password1234"
  })
  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: "user's role",
    enum: UserRole
  })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiProperty({
    description: "user's birthData",
    example: "2000-12-31"
  })
  @Column({ type: 'date' })
  birthDate: string;
}
