import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateActivitySectorDto {
  @ApiProperty({
    description: "activity sector's name",
    example: "Informatique",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  activitySector: string;
}
