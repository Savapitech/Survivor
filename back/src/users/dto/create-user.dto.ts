import { IsEmail, IsIn, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsIn([UserRole.SEEKER, UserRole.RECRUITER])
  role: UserRole;
}
