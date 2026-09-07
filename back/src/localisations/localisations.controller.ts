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
import { Public } from '../auth/public.decorateur';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  docLocalisationsDelete,
  docLocalisationsGet,
  docLocalisationsGetById,
  docLocalisationsPatch,
  docLocalisationsPost,
} from './localisation.doc';

@ApiTags('localisations')
@Controller('localisations')
export class LocalisationsController {
  constructor(private readonly localisationsService: LocalisationsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @docLocalisationsPost()
  create(@Body() createLocalisationDto: CreateLocalisationDto) {
    return this.localisationsService.create(createLocalisationDto);
  }

  @Public()
  @Get()
  @docLocalisationsGet()
  findAll(@Query() query: PaginationQueryDto) {
    return this.localisationsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @docLocalisationsGetById()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.localisationsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @docLocalisationsPatch()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocalisationDto: UpdateLocalisationDto,
  ) {
    return this.localisationsService.update(id, updateLocalisationDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @docLocalisationsDelete()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.localisationsService.remove(id);
  }
}
