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
import { docMessagesGetConversationsForRecruiter, docMessagesGetConversationsForSeeker, docMessagesGetThread, docMessagesPost, docMessagesPostThreadSeen } from './messages.doc';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @docMessagesPost()
  create(@Body() dto: CreateMessageDto) {
    return this.messagesService.create(dto);
  }

  @Get('thread')
  @docMessagesGetThread()
  findThread(@Query() query: FindThreadQueryDto) {
    return this.messagesService.findThread(query);
  }

  @Get('conversations/recruiter')
  @docMessagesGetConversationsForRecruiter()
  conversationsForRecruiter(
    @Query('recruiterId', ParseIntPipe) recruiterId: number,
  ) {
    return this.messagesService.conversationsForRecruiter(recruiterId);
  }

  @Get('conversations/seeker')
  @docMessagesGetConversationsForSeeker()
  conversationsForSeeker(@Query('seekerId', ParseIntPipe) seekerId: number) {
    return this.messagesService.conversationsForSeeker(seekerId);
  }

  @Post('seen')
  @docMessagesPostThreadSeen()
  markThreadSeen(@Body() dto: MarkThreadSeenDto) {
    return this.messagesService.markThreadSeen(dto);
  }
}
