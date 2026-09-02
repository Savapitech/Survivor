import { IsEnum, IsInt } from 'class-validator';
import { MessageSenderRole } from '../entities/message.entity';

export class MarkThreadSeenDto {
  @IsInt()
  recruiterId: number;

  @IsInt()
  seekerId: number;

  @IsEnum(MessageSenderRole)
  viewerRole: MessageSenderRole;
}
