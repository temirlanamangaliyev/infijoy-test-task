import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'Tima' })
  name: string;

  @IsDate()
  @ApiProperty({ example: '23.06.1994' })
  @Type(() => Date)
  dob: Date;

  @IsString()
  @ApiProperty({ example: '1 test test' })
  address: string;

  @IsString()
  @ApiProperty({ example: 'some description' })
  description: string;
}
