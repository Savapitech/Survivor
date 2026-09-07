import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Question {
  @ApiProperty({
    description: "question's id",
    type: Number,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "question's content",
    type: String,
    example: "êtes vous a l'aise de travailler en autonomie ?",
  })
  @Column()
  label: string;

  @ApiProperty({
    description: "question's weight",
    type: Number,
    example: 1,
  })
  @Column({ type: 'float', default: 1 })
  weight: number;

  @ApiProperty({
    description: "question's content",
    type: Boolean,
    example: true,
  })
  @Column({ default: true })
  active: boolean;
}
