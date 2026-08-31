import { PartialType } from '@nestjs/mapped-types';
import { CreateActivitySectorDto } from './create-activity-sector.dto';

export class UpdateActivitySectorDto extends PartialType(CreateActivitySectorDto) {}
