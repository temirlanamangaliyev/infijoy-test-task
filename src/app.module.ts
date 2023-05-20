import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Users } from './users/user.entity';
import { Relationships } from './relationships/relationships.entity';
import { AuthorizationModule } from './authorization/authorization.module';
import { RelationshipsModule } from './relationships/relationships.module';
import { FriendsModule } from './friends/friends.module';
import { Friends } from './friends/friends.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Users, Relationships, Friends],
      synchronize: true,
    }),
    UsersModule,
    AuthorizationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RelationshipsModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
