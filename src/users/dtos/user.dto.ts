import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  @ApiProperty({ example: 'Tima' })
  name: string;

  @Expose()
  @ApiProperty({ example: '23.06.1994' })
  dob: Date;

  @Expose()
  @ApiProperty({ example: '1 test test' })
  address: string;

  @Expose()
  @ApiProperty({ example: 'some description' })
  description: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
