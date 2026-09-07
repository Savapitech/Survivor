import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCompetenceDto {
  @ApiProperty({
    description: "competence's name",
    example: "travail d'équipe",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  competence: string;
}
