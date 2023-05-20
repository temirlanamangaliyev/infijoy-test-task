import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationships } from './relationships.entity';
import { RelationshipsService } from './relationships.service';

@Module({
  imports: [TypeOrmModule.forFeature([Relationships])],
  providers: [RelationshipsService],
  exports: [RelationshipsService],
})
export class RelationshipsModule {}
