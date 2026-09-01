import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeekersService } from './seekers.service';
import { SeekersController } from './seekers.controller';
import { Seeker } from './entities/seeker.entity';
import { User } from '../users/entities/user.entity';
import { Competence } from '../competences/entities/competence.entity';
import { Localisation } from '../localisations/entities/localisation.entity';
import { ActivitySector } from '../activity-sectors/entities/activity-sector.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Seeker,
      User,
      Competence,
      Localisation,
      ActivitySector,
    ]),
  ],
  controllers: [SeekersController],
  providers: [SeekersService],
  exports: [SeekersService],
})
export class SeekersModule {}
