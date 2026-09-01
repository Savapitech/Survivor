import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LocalisationsService } from './localisations.service';
import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { UpdateLocalisationDto } from './dto/update-localisation.dto';
import { PaginationQueryDto } from '../common/pagination';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('localisations')
@Controller('localisations')
export class LocalisationsController {
  constructor(private readonly localisationsService: LocalisationsService) {}

  @Post()
  create(@Body() createLocalisationDto: CreateLocalisationDto) {
    return this.localisationsService.create(createLocalisationDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.localisationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.localisationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocalisationDto: UpdateLocalisationDto,
  ) {
    return this.localisationsService.update(id, updateLocalisationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.localisationsService.remove(id);
  }
}
