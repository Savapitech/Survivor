import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeekersService } from './seekers.service';
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
  constructor(private readonly seekersService: SeekersService) {}

  @Post()
  @docSeekersPost()
  create(createSeekerDto: CreateSeekerDto, @Request() req: any) {
    return this.seekersService.create(createSeekerDto, req.user);
  }

  @Public()
  @Get()
  @docSeekersGet()
  findAll(query: FindSeekersQueryDto) {
    return this.seekersService.findAll(query);
  }

  @Public()
  @Get('by-user/:userId')
  @docSeekersGetByUserId()
  findByUserId(userId: string) {
    return this.seekersService.findByUserId(userId);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  @docSeekersGetAdmin()
  findAllAdmin(query: FindSeekersAdminQueryDto) {
    return this.seekersService.findAllAdmin(query);
  }

  @Get(':id')
  @Public()
  @docSeekersGetById()
  findOne( id: number, recruiterId?: number, viewerId?: string,
  ) {
    return this.seekersService.findOne(id, recruiterId, viewerId);
  }

  @Roles(UserRole.ADMIN)
  @Patch('admin/:id/moderate')
  @docSeekersPatch()
  moderateVideo( id: number, dto: ModerateSeekerVideoDto,
  ) {
    return this.seekersService.moderateVideo(id, dto);
  }

  @Patch(':id')
  @docSeekersPatchById()
  update( id: number, updateSeekerDto: UpdateSeekerDto, @Request() req: any,
  ) {
    return this.seekersService.update(id, updateSeekerDto, req.user);
  }

  @Delete(':id')
  @docSeekersDeleteById()
  remove(id: number, @Request() req: any) {
    return this.seekersService.remove(id, req.user);
  }
}
