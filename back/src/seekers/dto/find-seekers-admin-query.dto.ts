import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';
import { VideoStatus } from '../entities/seeker.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FindSeekersAdminQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: "videoStatus",
    enum: VideoStatus,
    example: VideoStatus.PENDING,
    required: false
  })
  @IsOptional()
  @IsEnum(VideoStatus)
  videoStatus?: VideoStatus;
}
