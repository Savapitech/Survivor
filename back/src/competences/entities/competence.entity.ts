import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Competence {
  @ApiProperty({
    description: "competence's id",
    example: "1"
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "competence's name",
    example: "Travail d'équipe"
  })
  @Column({ unique: true })
  competence: string;

  @ApiProperty({
    description: "list of seeker who have this competence",
    type: [Seeker],
  })
  @ManyToMany(() => Seeker, (seeker) => seeker.competences)
  seekers: Seeker[];
}
