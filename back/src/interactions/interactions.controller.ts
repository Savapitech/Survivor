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
import { ApiTags } from '@nestjs/swagger';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { FindInteractionsQueryDto } from './dto/find-interactions-query.dto';
import { MarkAllSeenDto } from './dto/mark-all-seen.dto';
import { RemoveFavoriteQueryDto } from './dto/remove-favorite-query.dto';
import {
  docInteractionsDeleteById,
  docInteractionsDeleteFavorite,
  docInteractionsDeleteLike,
  docInteractionsGetById,
  docInteractionsGetRecuiter,
  docInteractionsGetSeeker,
  docInteractionsGetUnread,
  docInteractionsPatchSeen,
  docInteractionsPost,
  docInteractionsPostSeen,
} from './interactions.doc';

@ApiTags('interactions')
@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  @docInteractionsPost()
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionsService.create(createInteractionDto);
  }

  @Get('sent')
  @docInteractionsGetRecuiter()
  findSent(
    @Query('recruiterId', ParseIntPipe) recruiterId: number,
    @Query() query: FindInteractionsQueryDto,
  ) {
    return this.interactionsService.findSent(recruiterId, query);
  }

  @Get('received')
  @docInteractionsGetSeeker()
  findReceived(
    @Query('seekerId', ParseIntPipe) seekerId: number,
    @Query() query: FindInteractionsQueryDto,
  ) {
    return this.interactionsService.findReceived(seekerId, query);
  }

  @Get('unread-count')
  @docInteractionsGetUnread()
  countUnread(@Query('seekerId', ParseIntPipe) seekerId: number) {
    return this.interactionsService.countUnread(seekerId);
  }

  @Post('seen-all')
  @docInteractionsPostSeen()
  markAllSeen(@Body() dto: MarkAllSeenDto) {
    return this.interactionsService.markAllSeen(dto.seekerId);
  }

  @Delete('favorite')
  @docInteractionsDeleteFavorite()
  removeFavorite(@Query() query: RemoveFavoriteQueryDto) {
    return this.interactionsService.removeFavorite(
      query.recruiterId,
      query.seekerId,
    );
  }

  @Delete('like')
  @docInteractionsDeleteLike()
  removeLike(@Query() query: RemoveFavoriteQueryDto) {
    return this.interactionsService.removeLike(
      query.recruiterId,
      query.seekerId,
    );
  }

  @Patch(':id/seen')
  @docInteractionsPatchSeen()
  markSeen(
    @Param('id', ParseIntPipe) id: number,
    @Query('seekerId', ParseIntPipe) seekerId: number,
  ) {
    return this.interactionsService.markSeen(id, seekerId);
  }

  @Get(':id')
  @docInteractionsGetById()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.interactionsService.findOne(id);
  }

  @Delete(':id')
  @docInteractionsDeleteById()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.interactionsService.remove(id);
  }
}
