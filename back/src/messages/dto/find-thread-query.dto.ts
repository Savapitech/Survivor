import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';
import { ApiProperty } from '@nestjs/swagger';

export class FindThreadQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: "recuiter's id",
    type: Number,
    example: 1,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  recruiterId: number;

  @ApiProperty({
    description: "seeker's id",
    type: Number,
    example: 2,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  seekerId: number;
}
