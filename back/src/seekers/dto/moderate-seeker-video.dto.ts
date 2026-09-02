import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { VideoStatus } from '../entities/seeker.entity';

export class ModerateSeekerVideoDto {
  @IsEnum([VideoStatus.APPROVED, VideoStatus.REJECTED])
  status: VideoStatus.APPROVED | VideoStatus.REJECTED;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsUUID()
  adminUserId: string;
}
