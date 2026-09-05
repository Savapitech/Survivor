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
import { Public } from '../auth/public.decorateur';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { docActivitySectorsDelete, docActivitySectorsGet, docActivitySectorsGetById, docActivitySectorsPatch, docActivitySectorsPost } from './activity-sectors.doc';

@ApiTags('activity-sectors')
@Controller('activity-sectors')
export class ActivitySectorsController {
  constructor(
    private readonly activitySectorsService: ActivitySectorsService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @docActivitySectorsPost()
  create(@Body() createActivitySectorDto: CreateActivitySectorDto) {
    return this.activitySectorsService.create(createActivitySectorDto);
  }

  @Public()
  @Get()
  @docActivitySectorsGet()
  findAll(@Query() query: PaginationQueryDto) {
    return this.activitySectorsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @docActivitySectorsGetById()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activitySectorsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @docActivitySectorsPatch()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivitySectorDto: UpdateActivitySectorDto,
  ) {
    return this.activitySectorsService.update(id, updateActivitySectorDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @docActivitySectorsDelete()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.activitySectorsService.remove(id);
  }
}
