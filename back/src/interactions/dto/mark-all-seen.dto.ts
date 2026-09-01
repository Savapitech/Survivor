import { IsInt } from 'class-validator';

export class MarkAllSeenDto {
  @IsInt()
  seekerId: number;
}
