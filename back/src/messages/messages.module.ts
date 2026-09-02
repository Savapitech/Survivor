import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { Recruiter } from '../recruiters/entities/recruiter.entity';
import { Seeker } from '../seekers/entities/seeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Recruiter, Seeker])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
