import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeekersService } from './seekers.service';
import { SeekersController } from './seekers.controller';
import { Seeker } from './entities/seeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seeker])],
  controllers: [SeekersController],
  providers: [SeekersService],
})
export class SeekersModule {}
