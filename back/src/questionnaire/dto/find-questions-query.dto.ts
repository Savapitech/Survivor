import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';

function toBoolean({ value }: { value: unknown }): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value === true || value === 'true';
}

export class FindQuestionsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  includeInactive?: boolean;
}
