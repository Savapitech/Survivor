import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUrl } from 'class-validator';
import { CreateSeekerDto } from './create-seeker.dto';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    description: "video",
    enum: VIDEO_HOST_WHITELIST,
    example: "youtube.com/watch?v=dQw4w9WgXcQ",
    required: false
  })
  @IsOptional()
  @IsUrl({ host_whitelist: VIDEO_HOST_WHITELIST })
  video?: string | null;
}
