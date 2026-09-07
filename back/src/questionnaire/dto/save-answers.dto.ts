import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class AnswerInputDto {
  @ApiProperty({
    description: "question's id",
    type: Number,
    example: 1,
    required: true,
  })
  @IsInt()
  questionId: number;

  @ApiProperty({
    description: "question's content",
    type: String,
    example: "êtes vous a l'aise de travailler en autonomie ?",
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  value: number;
}

export class SaveAnswersDto {
  @ApiProperty({
    description: "question's content",
    type: [AnswerInputDto],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerInputDto)
  answers: AnswerInputDto[];
}
