import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLocalisationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  localisation: string;
}
