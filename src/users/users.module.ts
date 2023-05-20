import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './user.entity';
import { RelationshipsModule } from 'src/relationships/relationships.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), RelationshipsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
