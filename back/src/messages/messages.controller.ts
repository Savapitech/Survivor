import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindThreadQueryDto } from './dto/find-thread-query.dto';
import { MarkThreadSeenDto } from './dto/mark-thread-seen.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }

  @Get('thread')
  findThread(@Query() query: FindThreadQueryDto) {
    return this.messagesService.findThread(query);
  }

  @Get('conversations/recruiter')
  conversationsForRecruiter(
    @Query('recruiterId', ParseIntPipe) recruiterId: number,
  ) {
    return this.messagesService.conversationsForRecruiter(recruiterId);
  }

  @Get('conversations/seeker')
  conversationsForSeeker(@Query('seekerId', ParseIntPipe) seekerId: number) {
    return this.messagesService.conversationsForSeeker(seekerId);
  }

  @Post('seen')
  markThreadSeen(@Body() dto: MarkThreadSeenDto) {
    return this.messagesService.markThreadSeen(dto);
  }
}
