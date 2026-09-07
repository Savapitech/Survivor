import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLocalisationDto {
  @ApiProperty({
    description: "localisation's name",
    example: 'Rennes',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  localisation: string;
}
