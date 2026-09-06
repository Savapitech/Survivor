import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { SeekersService } from './seekers.service';
import { LocalVideoProvider } from '../video-providers/providers/local-video.provider';
import { MAX_VIDEO_UPLOAD_BYTES } from '../video-providers/video-file-signature';
import { CreateSeekerDto } from './dto/create-seeker.dto';
import { UpdateSeekerDto } from './dto/update-seeker.dto';
import { FindSeekersQueryDto } from './dto/find-seekers-query.dto';
import { FindSeekersAdminQueryDto } from './dto/find-seekers-admin-query.dto';
import { ModerateSeekerVideoDto } from './dto/moderate-seeker-video.dto';
import { Public } from '../auth/public.decorateur';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { docSeekersDeleteById, docSeekersGet, docSeekersGetAdmin, docSeekersGetById, docSeekersGetByUserId, docSeekersPatch, docSeekersPatchById, docSeekersPost } from './seekers.doc';

@ApiTags('seekers')
@Controller('seekers')
export class SeekersController {
  constructor(
    private readonly seekersService: SeekersService,
    private readonly localVideoProvider: LocalVideoProvider,
  ) {}

  @Post()
  @docSeekersPost()
  create(@Body() createSeekerDto: CreateSeekerDto, @Request() req: any) {
    return this.seekersService.create(createSeekerDto, req.user);
  }

  @Public()
  @Get()
  @docSeekersGet()
  findAll(@Query() query: FindSeekersQueryDto) {
    return this.seekersService.findAll(query);
  }

  @Public()
  @Get('by-user/:userId')
  @docSeekersGetByUserId()
  findByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.seekersService.findByUserId(userId);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  @docSeekersGetAdmin()
  findAllAdmin(@Query() query: FindSeekersAdminQueryDto) {
    return this.seekersService.findAllAdmin(query);
  }

  @Get(':id')
  @Public()
  @docSeekersGetById()
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('recruiterId', new ParseIntPipe({ optional: true }))
    recruiterId?: number,
    @Query('viewerId') viewerId?: string,
  ) {
    return this.seekersService.findOne(id, recruiterId, viewerId);
  }

  @Roles(UserRole.ADMIN)
  @Patch('admin/:id/moderate')
  @docSeekersPatch()
  moderateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ModerateSeekerVideoDto,
  ) {
    return this.seekersService.moderateVideo(id, dto);
  }

  @Patch(':id')
  @docSeekersPatchById()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSeekerDto: UpdateSeekerDto,
    @Request() req: any,
  ) {
    return this.seekersService.update(id, updateSeekerDto, req.user);
  }

  @Delete(':id')
  @docSeekersDeleteById()
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.seekersService.remove(id, req.user);
  }

  @Post(':id/video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_VIDEO_UPLOAD_BYTES },
    }),
  )
  uploadVideo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('videoConsent') videoConsent: string,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file was uploaded (field name: file)');
    }
    return this.seekersService.uploadVideo(
      id,
      {
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalname: file.originalname,
      },
      videoConsent === 'true',
      req.user,
    );
  }

  @Delete(':id/video')
  deleteVideo(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.seekersService.deleteVideo(id, req.user);
  }

  @Public()
  @Get(':id/video/stream')
  async streamVideo(
    @Param('id', ParseIntPipe) id: number,
    @Query('viewerId') viewerId: string | undefined,
    @Res() res: Response,
  ) {
    const access = await this.seekersService.resolveLocalVideoFileAccess(
      id,
      viewerId,
    );
    if (!access) {
      res.status(404).json({ statusCode: 404, message: 'Video not found' });
      return;
    }
    const filePath = await this.localVideoProvider.getFilePath(
      access.seeker.videoExternalId!,
    );
    if (!filePath) {
      res.status(404).json({ statusCode: 404, message: 'Video not found' });
      return;
    }
    res.sendFile(filePath);
  }
}
