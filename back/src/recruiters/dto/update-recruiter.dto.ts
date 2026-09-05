import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateRecruiterDto } from './create-recruiter.dto';

export class UpdateRecruiterDto extends PartialType(
  OmitType(CreateRecruiterDto, ['userId'] as const),
) {}
