import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Seeker } from '../../seekers/entities/seeker.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ActivitySector {
  @ApiProperty({
    description: "activity sector's id",
    example: '1',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "activity sector's name",
    example: 'Informatique',
  })
  @Column({ unique: true })
  activitySector: string;

  @ApiProperty({
    description: 'list of seeker who are in this activity sector',
    type: [Seeker],
  })
  @ManyToMany(() => Seeker, (seeker) => seeker.activitySectors)
  seekers: Seeker[];
}
