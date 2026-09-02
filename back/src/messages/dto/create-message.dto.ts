import { IsEnum, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MessageSenderRole } from '../entities/message.entity';

export class CreateMessageDto {
  @IsInt()
  recruiterId: number;

  @IsInt()
  seekerId: number;

  @IsEnum(MessageSenderRole)
  senderRole: MessageSenderRole;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
