import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocalisationsService } from './localisations.service';
import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { UpdateLocalisationDto } from './dto/update-localisation.dto';

@Controller('localisations')
export class LocalisationsController {
  constructor(private readonly localisationsService: LocalisationsService) {}

  @Post()
  create(@Body() createLocalisationDto: CreateLocalisationDto) {
    return this.localisationsService.create(createLocalisationDto);
  }

  @Get()
  findAll() {
    return this.localisationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localisationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocalisationDto: UpdateLocalisationDto) {
    return this.localisationsService.update(+id, updateLocalisationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.localisationsService.remove(+id);
  }
}
