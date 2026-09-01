import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSeekerDto } from './create-seeker.dto';

export class UpdateSeekerDto extends PartialType(
  OmitType(CreateSeekerDto, ['userId'] as const),
) {}
