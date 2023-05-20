import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Relationships } from './relationships.entity';
import { FriendsService } from 'src/friends/friends.service';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(Relationships)
    private relationshipsRepository: Repository<Relationships>,
    private friendsService: FriendsService,
  ) {}

  getAllUserRelationships() {
    return this.relationshipsRepository.find();
  }

  getUserFollowings(userId: number) {
    return this.relationshipsRepository.find({
      where: { following_id: userId },
    });
  }

  getUserFollowers(userId: number) {
    return this.relationshipsRepository.find({
      where: { follower_id: userId },
    });
  }

  async createUserRelation(followerId: number, followingId: number) {
    if (followerId == followingId) {
      throw new BadRequestException('User cannot follow himself!');
    }

    const relationship = await this.getUserRelationship(
      followerId,
      followingId,
    );

    if (relationship) return relationship;

    const newRelationship = this.relationshipsRepository.create({
      follower_id: followerId,
      following_id: followingId,
    });

    const relation = this.relationshipsRepository.save(newRelationship);

    return relation;
  }

  async removeRelation(followerId: number, followingId: number) {
    const relationship = await this.getUserRelationship(
      followerId,
      followingId,
    );

    if (!relationship) {
      throw new NotFoundException('Relationship not found.');
    }

    relationship.deletedAt = new Date();
    return this.relationshipsRepository.save(relationship);
  }

  async getUserRelationship(followerId: number, followingId: number) {
    const relationship = await this.relationshipsRepository.findOne({
      where: {
        follower_id: followerId,
        following_id: followingId,
        deletedAt: null, // Exclude already deleted relationships
      },
    });

    return relationship;
  }
}
