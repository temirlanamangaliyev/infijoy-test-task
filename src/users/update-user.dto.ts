import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dob: Date;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  description: string;
}
