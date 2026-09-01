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
import { ActivitySectorsService } from './activity-sectors.service';
import { CreateActivitySectorDto } from './dto/create-activity-sector.dto';
import { UpdateActivitySectorDto } from './dto/update-activity-sector.dto';
import { PaginationQueryDto } from '../common/pagination';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('activity-sectors')
@Controller('activity-sectors')
export class ActivitySectorsController {
  constructor(
    private readonly activitySectorsService: ActivitySectorsService,
  ) {}

  @Post()
  create(@Body() createActivitySectorDto: CreateActivitySectorDto) {
    return this.activitySectorsService.create(createActivitySectorDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.activitySectorsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activitySectorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivitySectorDto: UpdateActivitySectorDto,
  ) {
    return this.activitySectorsService.update(id, updateActivitySectorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.activitySectorsService.remove(id);
  }
}
