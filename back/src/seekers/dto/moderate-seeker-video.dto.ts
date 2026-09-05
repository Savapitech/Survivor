import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { VideoStatus } from '../entities/seeker.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ModerateSeekerVideoDto {
  @ApiProperty({
    description: "status",
    enum: VideoStatus,
    example: VideoStatus.APPROVED,
    required: true
  })
  @IsEnum([VideoStatus.APPROVED, VideoStatus.REJECTED])
  status: VideoStatus.APPROVED | VideoStatus.REJECTED;

  @ApiProperty({
    description: "reason",
    example: "Not enought professional",
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiProperty({
    description: "adminUserId",
    example: 31,
    required: true
  })
  @IsUUID()
  adminUserId: string;
}
