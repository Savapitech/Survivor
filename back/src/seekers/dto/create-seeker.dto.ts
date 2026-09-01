import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
} from 'class-validator';

const VIDEO_HOST_WHITELIST = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
];

export class CreateSeekerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastname: string;

  @IsOptional()
  @IsUrl({ host_whitelist: VIDEO_HOST_WHITELIST })
  video?: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  competenceIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  localisationIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  activitySectorIds?: number[];
}
