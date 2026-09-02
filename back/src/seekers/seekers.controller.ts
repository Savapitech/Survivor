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
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeekersService } from './seekers.service';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { FindSeekersQueryDto } from './dto/find-seekers-query.dto';
import { FindSeekersAdminQueryDto } from './dto/find-seekers-admin-query.dto';
import { ModerateSeekerVideoDto } from './dto/moderate-seeker-video.dto';

@ApiTags('seekers')
@Controller('seekers')
export class SeekersController {
  constructor(private readonly seekersService: SeekersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a seeker profile for an existing user' })
  @ApiResponse({ status: 201, description: 'Seeker profile created' })
  @ApiResponse({
    status: 422,
    description:
      'Invalid body (missing field, video not a YouTube/Vimeo link, ...)',
    schema: {
      example: {
        statusCode: 422,
        message: ['name should not be empty', 'video must be a URL address'],
        error: 'Unprocessable Entity',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'userId does not match an existing user',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      },
    },
  })
  create(@Body() createSeekerDto: CreateSeekerDto) {
    return this.seekersService.create(createSeekerDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Paginated, filterable public feed of seeker profiles',
  })
  findAll(@Query() query: FindSeekersQueryDto) {
    return this.seekersService.findAll(query);
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Get the seeker profile linked to a user id' })
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.seekersService.findByUserId(userId);
  }

  @Get('admin')
  @ApiOperation({
    summary:
      'Admin listing of every seeker profile, unfiltered by certification, age, or video status',
  })
  findAllAdmin(@Query() query: FindSeekersAdminQueryDto) {
    return this.seekersService.findAllAdmin(query);
  }

  @Patch('admin/:id/moderate')
  @ApiOperation({ summary: "Approve or reject a seeker's video" })
  moderateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ModerateSeekerVideoDto,
  ) {
    return this.seekersService.moderateVideo(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single seeker profile' })
  @ApiResponse({
    status: 400,
    description: 'id is not a valid integer',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No seeker with this id',
    schema: {
      example: {
        statusCode: 404,
        message: 'Seeker not found',
        error: 'Not Found',
      },
    },
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('recruiterId', new ParseIntPipe({ optional: true }))
    recruiterId?: number,
    @Query('viewerId') viewerId?: string,
  ) {
    return this.seekersService.findOne(id, recruiterId, viewerId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeekerDto: UpdateSeekerDto,
  ) {
    return this.seekersService.update(id, updateSeekerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.seekersService.remove(id);
  }
}
