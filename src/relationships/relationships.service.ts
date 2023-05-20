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
    if (await this.hasUsersMutualSubscription(followerId, followingId)) {
      try {
        await Promise.all([
          this.friendsService.createFriendship(followerId, followingId),
          this.friendsService.createFriendship(followingId, followerId),
        ]);
      } catch (error) {}
    }
    return relation;
  }

  async hasUsersMutualSubscription(followerId, followingId): Promise<boolean> {
    const reverseRelationship = await this.getUserRelationship(
      followingId,
      followerId,
    );
    if (reverseRelationship) return true;

    return false;
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
    if (await this.hasUsersFriendship(followerId, followingId)) {
      // console.log('asdsssw');
    }
    return this.relationshipsRepository.save(relationship);
  }

  async hasUsersFriendship(
    followerId: number,
    followingId: number,
  ): Promise<boolean> {
    const followerFriendship = await this.friendsService.getUsersFriendship(
      followerId,
      followingId,
    );
    const followingFriendship = await this.friendsService.getUsersFriendship(
      followingId,
      followerId,
    );

    if (!followerFriendship && !followingFriendship) return false;

    return true;
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
