import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class RemoveFavoriteQueryDto {
  @Type(() => Number)
  @IsInt()
  recruiterId: number;

  @Type(() => Number)
  @IsInt()
  seekerId: number;
}
