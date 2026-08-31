import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivitySectorsService } from './activity-sectors.service';
import { CreateActivitySectorDto } from './dto/create-activity-sector.dto';
import { UpdateActivitySectorDto } from './dto/update-activity-sector.dto';

@Controller('activity-sectors')
export class ActivitySectorsController {
  constructor(private readonly activitySectorsService: ActivitySectorsService) {}

  @Post()
  create(@Body() createActivitySectorDto: CreateActivitySectorDto) {
    return this.activitySectorsService.create(createActivitySectorDto);
  }

  @Get()
  findAll() {
    return this.activitySectorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitySectorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivitySectorDto: UpdateActivitySectorDto) {
    return this.activitySectorsService.update(+id, updateActivitySectorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitySectorsService.remove(+id);
  }
}
