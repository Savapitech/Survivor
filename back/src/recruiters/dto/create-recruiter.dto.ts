import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateRecruiterDto {
  @ApiProperty({
    description: 'companyName',
    example: 'Fake company',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  companyName: string;

  @ApiProperty({
    description: 'userId',
    example: '93d5728f-165a-4526-a6d2-00a595dd1e12',
    required: true,
  })
  @IsUUID()
  userId: string;
}
