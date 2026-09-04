import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/pagination';
import { ApiTags } from '@nestjs/swagger';
import { docUsersDeleteById, docUsersGetAll, docUsersGetById, docUsersPatchById, docUsersPost } from './users.doc';
import { Public } from '../auth/public.decorateur';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './entities/user.entity';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @docUsersPost()
  create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @docUsersGetAll()
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @docUsersGetById()
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.usersService.findOne(id, req.user);
  }

  @Patch(':id')
  @docUsersPatchById()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @docUsersDeleteById()
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.usersService.remove(id, req.user);
  }
}
