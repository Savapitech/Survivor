import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitersService } from './recruiters.service';
import { RecruitersController } from './recruiters.controller';
import { Recruiter } from './entities/recruiter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recruiter])],
  controllers: [RecruitersController],
  providers: [RecruitersService],
})
export class RecruitersModule {}
