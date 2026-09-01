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
import { SeekersService } from './seekers.service';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { FindSeekersQueryDto } from './dto/find-seekers-query.dto';

@ApiTags('seekers')
@Controller('seekers')
export class SeekersController {
  constructor(private readonly seekersService: SeekersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a seeker profile for an existing user' })
  @ApiResponse({ status: 201, description: 'Seeker profile created' })
  @ApiResponse({
    status: 422,
    description: 'Invalid body (missing field, video not a YouTube/Vimeo link, ...)',
    schema: {
      example: {
        statusCode: 422,
        message: [
          'name should not be empty',
          'video must be a URL address',
        ],
        error: 'Unprocessable Entity',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'userId does not match an existing user',
    schema: {
      example: { statusCode: 404, message: 'User not found', error: 'Not Found' },
    },
  })
  create(@Body() createSeekerDto: CreateSeekerDto) {
    return this.seekersService.create(createSeekerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Paginated, filterable public feed of seeker profiles' })
  findAll(@Query() query: FindSeekersQueryDto) {
    return this.seekersService.findAll(query);
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
      example: { statusCode: 404, message: 'Seeker not found', error: 'Not Found' },
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.seekersService.findOne(id);
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
