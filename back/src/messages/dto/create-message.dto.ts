import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { MessageSenderRole } from '../entities/message.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: "message's recuiter's id",
    type: Number,
    example: 1,
    required: true,
  })
  @IsInt()
  recruiterId: number;

  @ApiProperty({
    description: "message's seeker's id",
    type: Number,
    example: 2,
    required: true,
  })
  @IsInt()
  seekerId: number;

  @ApiProperty({
    description: "message's sender's role",
    enum: MessageSenderRole,
    example: MessageSenderRole.RECRUITER,
    required: true,
  })
  @IsEnum(MessageSenderRole)
  senderRole: MessageSenderRole;

  @ApiProperty({
    description: "message's content",
    type: String,
    maxLength: 2000,
    example: 'Hello, I would like to discuss your profile.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
