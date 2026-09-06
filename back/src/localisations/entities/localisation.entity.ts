import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Localisation {
  @ApiProperty({
    description: "localisation's id",
    example: "1"
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "localisation's name",
    example: "Rennes"
  })
  @Column({ unique: true })
  localisation: string;

  @ApiProperty({
    description: "list of seeker who are in this localisation",
    type: [Seeker],
  })
  @ManyToMany(() => Seeker, (seeker) => seeker.localisations)
  seekers: Seeker[];
}
