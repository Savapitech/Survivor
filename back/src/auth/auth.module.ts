import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtExpiresIn, jwtSecret } from './constant';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: Number(jwtExpiresIn) },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtStrategy],
  exports: [PassportModule, LocalAuthGuard],
})
export class AuthModule {}
