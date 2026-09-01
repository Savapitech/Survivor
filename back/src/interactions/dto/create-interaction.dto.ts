import { IsEnum, IsInt } from 'class-validator';
import { InteractionType } from '../entities/interaction.entity';

export class CreateInteractionDto {
  @IsEnum(InteractionType)
  type: InteractionType;

  @IsInt()
  recruiterId: number;

  @IsInt()
  seekerId: number;
}
