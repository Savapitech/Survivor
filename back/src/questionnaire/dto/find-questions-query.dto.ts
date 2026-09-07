import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';
import { ApiProperty } from '@nestjs/swagger';

function toBoolean({ value }: { value: unknown }): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value === true || value === 'true';
}

export class FindQuestionsQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: "question's status",
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  includeInactive?: boolean;
}
