import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class AttemptQueryDto {
  @ApiProperty({
    description: "seeker's id",
    type: Number,
    example: 1,
    required: true
  })
  @Type(() => Number)
  @IsInt()
  seekerId: number;
}
