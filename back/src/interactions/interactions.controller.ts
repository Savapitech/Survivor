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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { FindInteractionsQueryDto } from './dto/find-interactions-query.dto';
import { MarkAllSeenDto } from './dto/mark-all-seen.dto';
import { RemoveFavoriteQueryDto } from './dto/remove-favorite-query.dto';

@ApiTags('interactions')
@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionsService.create(createInteractionDto);
  }

  @Get('sent')
  findSent(
    @Query('recruiterId', ParseIntPipe) recruiterId: number,
    @Query() query: FindInteractionsQueryDto,
  ) {
    return this.interactionsService.findSent(recruiterId, query);
  }

  @Get('received')
  findReceived(
    @Query('seekerId', ParseIntPipe) seekerId: number,
    @Query() query: FindInteractionsQueryDto,
  ) {
    return this.interactionsService.findReceived(seekerId, query);
  }

  @Get('unread-count')
  countUnread(@Query('seekerId', ParseIntPipe) seekerId: number) {
    return this.interactionsService.countUnread(seekerId);
  }

  @Post('seen-all')
  markAllSeen(@Body() dto: MarkAllSeenDto) {
    return this.interactionsService.markAllSeen(dto.seekerId);
  }

  @Delete('favorite')
  removeFavorite(@Query() query: RemoveFavoriteQueryDto) {
    return this.interactionsService.removeFavorite(
      query.recruiterId,
      query.seekerId,
    );
  }

  @Patch(':id/seen')
  @ApiOperation({ summary: 'Mark an interaction as seen by its recipient seeker' })
  @ApiResponse({ status: 200, description: 'Interaction marked seen (idempotent)' })
  @ApiResponse({
    status: 403,
    description: 'This interaction does not belong to the given seekerId',
    schema: {
      example: {
        statusCode: 403,
        message: 'This interaction does not belong to you',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No interaction with this id',
    schema: {
      example: {
        statusCode: 404,
        message: 'Interaction not found',
        error: 'Not Found',
      },
    },
  })
  markSeen(
    @Param('id', ParseIntPipe) id: number,
    @Query('seekerId', ParseIntPipe) seekerId: number,
  ) {
    return this.interactionsService.markSeen(id, seekerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.interactionsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.interactionsService.remove(id);
  }
}
