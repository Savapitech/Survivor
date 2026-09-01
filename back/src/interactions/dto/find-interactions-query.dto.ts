import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';
import { InteractionType } from '../entities/interaction.entity';

function toBoolean({ value }: { value: unknown }): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value === true || value === 'true';
}

export class FindInteractionsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(InteractionType)
  type?: InteractionType;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  unreadOnly?: boolean;
}
