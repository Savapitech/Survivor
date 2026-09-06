import { PartialType } from '@nestjs/swagger';
import { CreateActivitySectorDto } from './create-activity-sector.dto';

export class UpdateActivitySectorDto extends PartialType(
  CreateActivitySectorDto,
) {}
