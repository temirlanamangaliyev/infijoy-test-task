import { Type } from 'class-transformer';
import { IsDate, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Tima' })
  name: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({ example: '23.06.1994' })
  @Type(() => Date)
  dob: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '1 test test' })
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'some description' })
  description: string;
}
