import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  dob: Date;

  @IsString()
  address: string;

  @IsString()
  description: string;
}
