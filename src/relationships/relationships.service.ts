import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Relationships } from './relationships.entity';
import { FriendsService } from 'src/friends/friends.service';

@Injectable()
export class RelationshipsService {
  private readonly logger = new Logger(RelationshipsService.name);

  constructor(
    @InjectRepository(Relationships)
    private relationshipsRepository: Repository<Relationships>,
    private friendsService: FriendsService,
  ) {}

  getAllUserRelationships(): Promise<Relationships[]> {
    return this.relationshipsRepository.find();
  }

  getUserFollowings(userId: number): Promise<Relationships[]> {
    return this.relationshipsRepository.find({
      where: { following_id: userId },
    });
  }

  getUserFollowers(userId: number): Promise<Relationships[]> {
    return this.relationshipsRepository.find({
      where: { follower_id: userId },
    });
  }

  async createUserRelation(
    followerId: number,
    followingId: number,
  ): Promise<Relationships> {
    this.logger.log(
      `Create user relation for ${followerId} and  ${followingId}`,
    );
    if (followerId == followingId) {
      this.logger.error('User cannot follow himself!');
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
      this.logger.log(`Create friendship for ${followerId}, ${followingId} `);
      try {
        await Promise.all([
          this.friendsService.createFriendship(followerId, followingId),
          this.friendsService.createFriendship(followingId, followerId),
        ]);
      } catch (error) {
        this.logger.error('Creating friendship failed with error', error);
        throw error;
      }
    }
    return relation;
  }

  async hasUsersMutualSubscription(
    followerId: number,
    followingId: number,
  ): Promise<boolean> {
    const reverseRelationship = await this.getUserRelationship(
      followingId,
      followerId,
    );
    if (reverseRelationship) return true;

    return false;
  }

  async removeRelation(
    followerId: number,
    followingId: number,
  ): Promise<Relationships> {
    const relationship = await this.getUserRelationship(
      followerId,
      followingId,
    );

    if (!relationship) {
      this.logger.error(`Relationship already exists ${relationship} `);
      throw new NotFoundException('Relationship not found.');
    }

    if (await this.hasUsersFriendship(followerId, followingId)) {
      this.logger.log(
        `Deleting friendship for ${followerId} and ${followingId}`,
      );
      try {
        await Promise.all([
          this.friendsService.deleteFriendship(followerId, followingId),
          this.friendsService.deleteFriendship(followingId, followerId),
        ]);
      } catch (error) {
        this.logger.error('Delete friendship failed with error', error);
        throw error;
      }
    }
    return this.relationshipsRepository.save({
      ...relationship,
      deletedAt: new Date(),
    });
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

    if (!followerFriendship || !followingFriendship) return false;

    return true;
  }
  async getUserRelationship(
    followerId: number,
    followingId: number,
  ): Promise<Relationships> {
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
