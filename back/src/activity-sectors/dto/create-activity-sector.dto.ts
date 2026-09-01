import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateActivitySectorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  activitySector: string;
}
