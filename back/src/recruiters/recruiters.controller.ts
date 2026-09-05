import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { RecruitersService } from './recruiters.service';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { PaginationQueryDto } from '../common/pagination';
import { ApiTags } from '@nestjs/swagger';
import { docRecruitersDelete, docRecruitersGet, docRecruitersGetById, docRecruitersGetByUserId, docRecruitersPatch, docRecruitersPost } from './recruiter.doc';

@ApiTags('recruiters')
@Controller('recruiters')
export class RecruitersController {
  constructor(private readonly recruitersService: RecruitersService) {}

  @Post()
  @docRecruitersPost()
  create(createRecruiterDto: CreateRecruiterDto) {
    return this.recruitersService.create(createRecruiterDto);
  }

  @Get()
  @docRecruitersGet()
  findAll(query: PaginationQueryDto) {
    return this.recruitersService.findAll(query);
  }

  @Get('by-user/:userId')
  @docRecruitersGetByUserId()
  findByUserId(userId: string) {
    return this.recruitersService.findByUserId(userId);
  }

  @Get(':id')
  @docRecruitersGetById()
  findOne(id: number) {
    return this.recruitersService.findOne(id);
  }

  @Patch(':id')
  @docRecruitersPatch()
  update(id: number, updateRecruiterDto: UpdateRecruiterDto) {
    return this.recruitersService.update(id, updateRecruiterDto);
  }

  @Delete(':id')
  @docRecruitersDelete()
  remove(id: number) {
    return this.recruitersService.remove(id);
  }
}
