import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalisationsService } from './localisations.service';
import { LocalisationsController } from './localisations.controller';
import { Localisation } from './entities/localisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Localisation])],
  controllers: [LocalisationsController],
  providers: [LocalisationsService],
})
export class LocalisationsModule {}
