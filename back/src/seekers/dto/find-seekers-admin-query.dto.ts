import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination';
import { VideoStatus } from '../entities/seeker.entity';

export class FindSeekersAdminQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(VideoStatus)
  videoStatus?: VideoStatus;
}
