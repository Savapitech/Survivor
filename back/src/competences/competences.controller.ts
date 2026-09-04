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
import { CompetencesService } from './competences.service';
import { CreateCompetenceDto } from './dto/create-competence.dto';
import { UpdateCompetenceDto } from './dto/update-competence.dto';
import { PaginationQueryDto } from '../common/pagination';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorateur';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('competences')
@Controller('competences')
export class CompetencesController {
  constructor(private readonly competencesService: CompetencesService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createCompetenceDto: CreateCompetenceDto) {
    return this.competencesService.create(createCompetenceDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.competencesService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.competencesService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompetenceDto: UpdateCompetenceDto,
  ) {
    return this.competencesService.update(id, updateCompetenceDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.competencesService.remove(id);
  }
}
