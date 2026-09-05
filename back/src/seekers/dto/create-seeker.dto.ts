import { ApiProperty } from '@nestjs/swagger';
import {
  Equals,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';

const VIDEO_HOST_WHITELIST = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
];

export class CreateSeekerDto {
  @ApiProperty({
    description: "name",
    example: "Jean-Charle",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty({
    description: "lastname",
    example: "Fontaine",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastname: string;

  @ApiProperty({
    description: "video's URL",
    enum: VIDEO_HOST_WHITELIST,
    example: VIDEO_HOST_WHITELIST[0] + "/watch?v=dQw4w9WgXcQ",
    required: false
  })
  @IsOptional()
  @IsUrl({ host_whitelist: VIDEO_HOST_WHITELIST })
  video?: string;

  @ApiProperty({
    description: "user's consent",
    type: Boolean,
    example: true,
    required: true
  })
  @ValidateIf((o: CreateSeekerDto) => Boolean(o.video))
  @Equals(true, {
    message:
      'Le consentement à la publication de la vidéo (image et voix) est requis.',
  })
  videoConsent?: boolean;

  @ApiProperty({
    description: "user's id",
    example: '93d5728f-165a-4526-a6d2-00a595dd1e12',
    required: true
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: "user's competences",
    type: [Number],
    examples: [1, 2, 3],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  competenceIds?: number[];

  @ApiProperty({
    description: "user's localisations",
    type: [Number],
    examples: [1, 2, 3],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  localisationIds?: number[];

  @ApiProperty({
    description: "user's activitySectors",
    type: [Number],
    examples: [1, 2, 3],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  activitySectorIds?: number[];
}
