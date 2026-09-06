import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: "question's content",
    type: String,
    example: "êtes vous a l'aise de travailler en autonomie ?",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  label: string;

  @ApiProperty({
    description: "question's weight",
    type: Number,
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10)
  weight?: number;
}
