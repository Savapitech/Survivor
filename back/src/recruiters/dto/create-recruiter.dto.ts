import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateRecruiterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  companyName: string;

  @IsUUID()
  userId: string;
}
