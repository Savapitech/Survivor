import { IsEnum, IsInt } from 'class-validator';
import { MessageSenderRole } from '../entities/message.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MarkThreadSeenDto {
  @ApiProperty({
    description: "recuiter's id",
    type: Number,
    example: 1,
    required: true
  })
  @IsInt()
  recruiterId: number;

  @ApiProperty({
    description: "seeker's id",
    type: Number,
    example: 2,
    required: true
  })
  @IsInt()
  seekerId: number;

  @ApiProperty({
    description: "sender's role",
    enum: MessageSenderRole,
    example: MessageSenderRole.RECRUITER,
    required: true
  })
  @IsEnum(MessageSenderRole)
  viewerRole: MessageSenderRole;
}
