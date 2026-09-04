import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
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
}
