import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';
import { ApiProperty } from '@nestjs/swagger';

function toIntArray({ value }: { value: unknown }): number[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  const raw = Array.isArray(value) ? value : String(value).split(',');
  return raw.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
}

export class FindSeekersQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: "List of competence's id",
    type: [Number],
    required: false
  })
  @IsOptional()
  @Transform(toIntArray)
  @IsArray()
  @IsInt({ each: true })
  competenceIds?: number[];

  @ApiProperty({
    description: "List of localisation's id",
    type: [Number],
    required: false
  })
  @IsOptional()
  @Transform(toIntArray)
  @IsArray()
  @IsInt({ each: true })
  localisationIds?: number[];

  @ApiProperty({
    description: "List of activity sector's id",
    type: [Number],
    required: false
  })
  @IsOptional()
  @Transform(toIntArray)
  @IsArray()
  @IsInt({ each: true })
  activitySectorIds?: number[];

  @ApiProperty({
    description: "other filter",
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: "recruiter's id",
    type: Number,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  recruiterId?: number;
}
