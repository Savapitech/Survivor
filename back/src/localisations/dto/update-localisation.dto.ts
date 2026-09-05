import { PartialType } from '@nestjs/swagger';
import { CreateLocalisationDto } from './create-localisation.dto';

export class UpdateLocalisationDto extends PartialType(CreateLocalisationDto) {}
