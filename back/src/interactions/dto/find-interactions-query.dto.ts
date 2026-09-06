import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';
import { InteractionType } from '../entities/interaction.entity';
import { ApiProperty } from '@nestjs/swagger';

function toBoolean({ value }: { value: unknown }): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value === true || value === 'true';
}

export class FindInteractionsQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: "Interaction's type",
    enum: InteractionType,
    example: InteractionType.LIKE,
    required: false
  })
  @IsOptional()
  @IsEnum(InteractionType)
  type?: InteractionType;

  @ApiProperty({
    description: "Interaction's unread ?",
    type: Boolean,
    example: true,
    required: false
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  unreadOnly?: boolean;
}
