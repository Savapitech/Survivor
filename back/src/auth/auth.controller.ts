import { Controller, Post, Body, UseGuards , Request, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  validateUser(@Body() user: LoginUserDto){
    let validateUser = this.authService.validateUser(user.email, user.password);
    if (!validateUser){
      throw new UnauthorizedException("invalid user");
    }
    return this.authService.login(validateUser);
  };

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    return req.logout();
  }
}
