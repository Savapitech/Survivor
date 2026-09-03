import { IsDateString, IsEmail, IsIn, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { MinAge } from '../../common/validators/min-age.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "user's email",
    example: "fake.email@extension.com"
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "user's password",
    minLength: 8,
    example: "password1234"
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: "assigne the role of the user",
    enum: [UserRole.SEEKER, UserRole.RECRUITER, UserRole.ADMIN],
    })
  @IsIn([UserRole.SEEKER, UserRole.RECRUITER, UserRole.ADMIN])
  role: UserRole;

  @ApiProperty({
    description: "verify if the user is older than 16",
    example: "2000-12-31",
    minimum: 16,
  })
  @IsDateString()
  @MinAge(16)
  birthDate: string;
}
