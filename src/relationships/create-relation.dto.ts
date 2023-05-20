import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRelationDto {
  @IsNumber()
  @ApiProperty({ example: 1 })
  followerId: number;
}
