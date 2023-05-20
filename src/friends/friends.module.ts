import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from './friends.entity';
import { FriendsService } from './friends.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friends])],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
