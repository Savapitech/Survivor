import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { Interaction } from './entities/interaction.entity';
import { Recruiter } from '../recruiters/entities/recruiter.entity';
import { Seeker } from '../seekers/entities/seeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interaction, Recruiter, Seeker])],
  controllers: [InteractionsController],
  providers: [InteractionsService],
})
export class InteractionsModule {}
