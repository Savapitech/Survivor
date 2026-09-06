import { IsEnum, IsInt } from 'class-validator';
import { InteractionType } from '../entities/interaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInteractionDto {
  @ApiProperty({
    description: "interaction's type",
    enum: InteractionType,
    example: InteractionType.LIKE,
    required: true
  })
  @IsEnum(InteractionType)
  type: InteractionType;

  @ApiProperty({
    description: "recuiter's id",
    enum: Number,
    example: 1,
    required: true
  })
  @IsInt()
  recruiterId: number;

  @ApiProperty({
    description: "seeker's id",
    enum: Number,
    example: 1,
    required: true
  })
  @IsInt()
  seekerId: number;
}
