import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Relationships } from './relationships.entity';
import { Friends } from '../friends/friends.entity';
import { RelationshipsService } from './relationships.service';
import { FriendsService } from '../friends/friends.service';

describe('RelationshipsService', () => {
  let relationshipsService: RelationshipsService;
  let relationshipsRepository: Repository<Relationships>;
  let mockFriendsService: FriendsService;
  let friendsRepository: Repository<Friends>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationshipsService,
        FriendsService,
        {
          provide: getRepositoryToken(Relationships),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Friends),
          useClass: Repository,
        },
      ],
    }).compile();

    mockFriendsService = module.get<FriendsService>(FriendsService);
    relationshipsService =
      module.get<RelationshipsService>(RelationshipsService);
    relationshipsRepository = module.get<Repository<Relationships>>(
      getRepositoryToken(Relationships),
    );
    friendsRepository = module.get<Repository<Friends>>(
      getRepositoryToken(Friends),
    );
  });

  describe('getAllUserRelationships', () => {
    it('should get all relationships', async () => {
      const relationships = [{ id: 1 }, { id: 2 }] as Relationships[];

      const findSpy = jest
        .spyOn(relationshipsRepository, 'find')
        .mockResolvedValue(relationships);

      const result = await relationshipsService.getAllUserRelationships();

      expect(findSpy).toHaveBeenCalled();
      expect(result).toEqual(relationships);
    });
  });

  describe('getUserFollowings', () => {
    it('should get followings of a user', async () => {
      const userId = 1;
      const followings = [
        { follower_id: 1, following_id: 2 },
        { follower_id: 1, following_id: 3 },
      ] as Relationships[];

      const findSpy = jest
        .spyOn(relationshipsRepository, 'find')
        .mockResolvedValue(followings);

      const result = await relationshipsService.getUserFollowings(userId);

      expect(findSpy).toHaveBeenCalledWith({ where: { following_id: userId } });
      expect(result).toEqual(followings);
    });
  });

  describe('getUserFollowers', () => {
    it('should get followers of a user', async () => {
      const userId = 1;
      const followers = [
        { follower_id: 2, following_id: 1 },
        { follower_id: 3, following_id: 1 },
      ] as Relationships[];

      const findSpy = jest
        .spyOn(relationshipsRepository, 'find')
        .mockResolvedValue(followers);

      const result = await relationshipsService.getUserFollowers(userId);

      expect(findSpy).toHaveBeenCalledWith({ where: { follower_id: userId } });
      expect(result).toEqual(followers);
    });
  });

  describe('createUserRelation', () => {
    it('should create a new user relation', async () => {
      const followerId = 1;
      const followingId = 2;
      const newRelationship = {
        follower_id: followerId,
        following_id: followingId,
      } as Relationships;
      const savedRelationship = {
        id: 1,
        follower_id: followerId,
        following_id: followingId,
      } as Relationships;
      jest
        .spyOn(relationshipsService, 'getUserRelationship')
        .mockResolvedValue(null);
      const createSpy = jest
        .spyOn(relationshipsRepository, 'create')
        .mockReturnValue(newRelationship);
      const saveSpy = jest
        .spyOn(relationshipsRepository, 'save')
        .mockResolvedValue(savedRelationship);

      const result = await relationshipsService.createUserRelation(
        followerId,
        followingId,
      );
      expect(createSpy).toHaveBeenCalledWith({
        follower_id: followerId,
        following_id: followingId,
      });
      expect(saveSpy).toHaveBeenCalledWith(newRelationship);
      expect(result).toEqual(savedRelationship);
    });

    it('should throw BadRequestException if followerId and followingId are the same', async () => {
      const followerId = 1;
      const followingId = 1;
      await expect(
        relationshipsService.createUserRelation(followerId, followingId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return existing relationship if it already exists', async () => {
      const followerId = 1;
      const followingId = 2;
      const existingRelationship = {
        id: 1,
        follower_id: followerId,
        following_id: followingId,
      } as Relationships;
      jest
        .spyOn(relationshipsService, 'getUserRelationship')
        .mockResolvedValue(existingRelationship);
      const createSpy = jest.spyOn(relationshipsRepository, 'create');
      const saveSpy = jest.spyOn(relationshipsRepository, 'save');
      const createFriendshipSpy = jest.spyOn(
        mockFriendsService,
        'createFriendship',
      );
      const result = await relationshipsService.createUserRelation(
        followerId,
        followingId,
      );
      expect(createSpy).not.toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
      expect(createFriendshipSpy).not.toHaveBeenCalled();
      expect(result).toEqual(existingRelationship);
    });
    it('should create friendship if users have a mutual subscription', async () => {
      const followerId = 1;
      const followingId = 2;
      const newRelationship = {
        follower_id: followerId,
        following_id: followingId,
      } as Relationships;
      const savedRelationship = {
        id: 1,
        follower_id: followerId,
        following_id: followingId,
      } as Relationships;
      jest
        .spyOn(relationshipsService, 'getUserRelationship')
        .mockResolvedValue(null);
      const createSpy = jest
        .spyOn(relationshipsRepository, 'create')
        .mockReturnValue(newRelationship);
      const saveSpy = jest
        .spyOn(relationshipsRepository, 'save')
        .mockResolvedValue(savedRelationship);
      const createFriendshipSpy = jest
        .spyOn(mockFriendsService, 'createFriendship')
        .mockResolvedValue({} as Friends);
      jest
        .spyOn(relationshipsService, 'hasUsersMutualSubscription')
        .mockResolvedValue(true);
      const result = await relationshipsService.createUserRelation(
        followerId,
        followingId,
      );
      expect(createSpy).toHaveBeenCalledWith({
        follower_id: followerId,
        following_id: followingId,
      });
      expect(saveSpy).toHaveBeenCalledWith(newRelationship);
      expect(createFriendshipSpy).toHaveBeenCalledWith(followerId, followingId);
      expect(result).toEqual(savedRelationship);
    });
  });

  describe('hasUsersMutualSubscription', () => {
    it('should return true if users have a mutual subscription', async () => {
      const followerId = 1;
      const followingId = 2;
      const reverseRelationship = {
        follower_id: followingId,
        following_id: followerId,
      } as Relationships;

      jest
        .spyOn(relationshipsService, 'getUserRelationship')
        .mockResolvedValue(reverseRelationship);

      const result = await relationshipsService.hasUsersMutualSubscription(
        followerId,
        followingId,
      );

      expect(result).toBe(true);
    });

    it('should return false if users do not have a mutual subscription', async () => {
      const followerId = 1;
      const followingId = 2;

      jest
        .spyOn(relationshipsService, 'getUserRelationship')
        .mockResolvedValue(null);

      const result = await relationshipsService.hasUsersMutualSubscription(
        followerId,
        followingId,
      );

      expect(result).toBe(false);
    });
  });

  describe('removeRelation', () => {
    it('should remove user relation', async () => {
      const followerId = 1;
      const followingId = 2;
      const relationship = {
        id: 1,
        follower_id: followerId,
        following_id: followingId,
      } as Relationships;
      const deletedRelationship = {
        ...relationship,
        deletedAt: new Date(),
      } as Relationships;

      jest
        .spyOn(relationshipsService, 'getUserRelationship')
        .mockResolvedValue(relationship);
      const deleteFriendshipSpy = jest
        .spyOn(mockFriendsService, 'deleteFriendship')
        .mockResolvedValue(undefined);
      const saveSpy = jest
        .spyOn(relationshipsRepository, 'save')
        .mockResolvedValue(deletedRelationship);
      jest
        .spyOn(relationshipsRepository, 'findOne')
        .mockResolvedValue(relationship);
      jest.spyOn(friendsRepository, 'findOne').mockResolvedValue({} as Friends);

      const result = await relationshipsService.removeRelation(
        followerId,
        followingId,
      );

      expect(deleteFriendshipSpy).toHaveBeenCalledWith(followerId, followingId);
      expect(deleteFriendshipSpy).toHaveBeenCalledWith(followingId, followerId);
      expect(saveSpy).toHaveBeenCalledWith({
        ...relationship,
        deletedAt: expect.any(Date),
      });
      expect(result).toEqual(deletedRelationship);
    });

    it('should throw NotFoundException if relationship does not exist', async () => {
      const followerId = 1;
      const followingId = 2;

      jest
        .spyOn(relationshipsService, 'getUserRelationship')
        .mockResolvedValue(null);
      const deleteFriendshipSpy = jest.spyOn(
        mockFriendsService,
        'deleteFriendship',
      );
      const saveSpy = jest.spyOn(relationshipsRepository, 'save');

      await expect(
        relationshipsService.removeRelation(followerId, followingId),
      ).rejects.toThrow(NotFoundException);

      expect(deleteFriendshipSpy).not.toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('should delete friendship if users have a friendship', async () => {
      const followerId = 1;
      const followingId = 2;
      const relationship = {
        id: 1,
        follower_id: followerId,
        following_id: followingId,
      } as Relationships;

      jest
        .spyOn(relationshipsService, 'getUserRelationship')
        .mockResolvedValue(relationship);
      const deleteFriendshipSpy = jest
        .spyOn(mockFriendsService, 'deleteFriendship')
        .mockResolvedValue(undefined);
      const saveSpy = jest
        .spyOn(relationshipsRepository, 'save')
        .mockResolvedValue({
          ...relationship,
          deletedAt: new Date(),
        } as Relationships);
      jest.spyOn(friendsRepository, 'findOne').mockResolvedValue({} as Friends);

      const result = await relationshipsService.removeRelation(
        followerId,
        followingId,
      );

      expect(deleteFriendshipSpy).toHaveBeenCalledWith(followerId, followingId);
      expect(deleteFriendshipSpy).toHaveBeenCalledWith(followingId, followerId);
      expect(saveSpy).toHaveBeenCalledWith({
        ...relationship,
        deletedAt: expect.any(Date),
      });
      expect(result).toEqual({ ...relationship, deletedAt: expect.any(Date) });
    });
  });

  describe('hasUsersFriendship', () => {
    it('should return true if users have a friendship', async () => {
      const followerId = 1;
      const followingId = 2;
      const followerFriendship = {} as any;
      const followingFriendship = {} as any;

      jest
        .spyOn(mockFriendsService, 'getUsersFriendship')
        .mockResolvedValueOnce(followerFriendship);
      jest
        .spyOn(mockFriendsService, 'getUsersFriendship')
        .mockResolvedValueOnce(followingFriendship);

      const result = await relationshipsService.hasUsersFriendship(
        followerId,
        followingId,
      );

      expect(result).toBe(true);
    });

    it('should return false if users do not have a friendship', async () => {
      const followerId = 1;
      const followingId = 2;

      jest
        .spyOn(mockFriendsService, 'getUsersFriendship')
        .mockResolvedValueOnce(null);

      const result = await relationshipsService.hasUsersFriendship(
        followerId,
        followingId,
      );

      expect(result).toBe(false);
    });
  });
});
