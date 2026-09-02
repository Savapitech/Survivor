import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';

export class FindThreadQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  recruiterId: number;

  @Type(() => Number)
  @IsInt()
  seekerId: number;
}
