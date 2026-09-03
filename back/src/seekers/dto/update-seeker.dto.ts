import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUrl } from 'class-validator';
import { CreateSeekerDto } from './create-seeker.dto';

const VIDEO_HOST_WHITELIST = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
];

export class UpdateSeekerDto extends PartialType(
  OmitType(CreateSeekerDto, ['userId', 'video'] as const),
) {
  @IsOptional()
  @IsUrl({ host_whitelist: VIDEO_HOST_WHITELIST })
  video?: string | null;
}
