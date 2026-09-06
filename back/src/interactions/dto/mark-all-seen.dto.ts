import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class MarkAllSeenDto {
  @ApiProperty({
    description: "seeker's id",
    type: Number,
    example: 1,
    required: true
  })
  @IsInt()
  seekerId: number;
}
