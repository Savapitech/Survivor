import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';

function toIntArray({ value }: { value: unknown }): number[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  const raw = Array.isArray(value) ? value : String(value).split(',');
  return raw.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
}

export class FindSeekersQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(toIntArray)
  @IsArray()
  @IsInt({ each: true })
  competenceIds?: number[];

  @IsOptional()
  @Transform(toIntArray)
  @IsArray()
  @IsInt({ each: true })
  localisationIds?: number[];

  @IsOptional()
  @Transform(toIntArray)
  @IsArray()
  @IsInt({ each: true })
  activitySectorIds?: number[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  recruiterId?: number;
}
