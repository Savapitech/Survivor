import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitySectorsService } from './activity-sectors.service';
import { ActivitySectorsController } from './activity-sectors.controller';
import { ActivitySector } from './entities/activity-sector.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivitySector])],
  controllers: [ActivitySectorsController],
  providers: [ActivitySectorsService],
})
export class ActivitySectorsModule {}
