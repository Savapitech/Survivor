import { IsDateString, IsEmail, IsIn, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { MinAge } from '../../common/validators/min-age.validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsIn([UserRole.SEEKER, UserRole.RECRUITER, UserRole.ADMIN])
  role: UserRole;

  @IsDateString()
  @MinAge(16)
  birthDate: string;
}
