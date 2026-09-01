import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  label: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10)
  weight?: number;
}
