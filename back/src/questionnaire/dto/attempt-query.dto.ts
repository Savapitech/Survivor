import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class AttemptQueryDto {
  @Type(() => Number)
  @IsInt()
  seekerId: number;
}
