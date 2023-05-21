import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friends } from './friends.entity';
import { FriendsService } from './friends.service';

describe('FriendsService', () => {
  let friendsService: FriendsService;
  let friendsRepository: Repository<Friends>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        {
          provide: getRepositoryToken(Friends),
          useClass: Repository,
        },
      ],
    }).compile();

    friendsService = module.get<FriendsService>(FriendsService);
    friendsRepository = module.get<Repository<Friends>>(
      getRepositoryToken(Friends),
    );
  });

  describe('createFriendship', () => {
    it('should create a new friendship', async () => {
      const userId = 1;
      const friendId = 2;
      const friendshipData = { user_id: userId, friend_id: friendId };

      jest
        .spyOn(friendsRepository, 'create')
        .mockReturnValue(friendshipData as Friends);

      const saveSpy = jest
        .spyOn(friendsRepository, 'save')
        .mockResolvedValue(friendshipData as Friends);

      const result = await friendsService.createFriendship(userId, friendId);

      expect(saveSpy).toHaveBeenCalledWith(friendshipData);
      expect(result).toEqual(friendshipData);
    });
  });

  describe('getUserFriends', () => {
    it('should get friends of a user', async () => {
      const userId = 1;
      const friends = [
        { id: 1, user_id: userId, friend_id: 2 },
        { id: 2, user_id: userId, friend_id: 3 },
      ];

      const findSpy = jest
        .spyOn(friendsRepository, 'find')
        .mockResolvedValue(friends as Friends[]);

      const result = await friendsService.getUserFriends(userId);

      expect(findSpy).toHaveBeenCalledWith({ where: { user_id: userId } });
      expect(result).toEqual(friends);
    });
  });

  describe('getUsersFriendship', () => {
    it('should get a friendship between two users', async () => {
      const userId = 1;
      const friendId = 2;
      const friendship = { id: 1, user_id: userId, friend_id: friendId };

      const findOneSpy = jest
        .spyOn(friendsRepository, 'findOne')
        .mockResolvedValue(friendship as Friends);

      const result = await friendsService.getUsersFriendship(userId, friendId);

      expect(findOneSpy).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          friend_id: friendId,
          deletedAt: null,
        },
      });
      expect(result).toEqual(friendship);
    });
  });

  describe('deleteFriendship', () => {
    it('should delete a friendship', async () => {
      const userId = 1;
      const friendId = 2;
      const friendship = { id: 1, user_id: userId, friend_id: friendId };

      jest
        .spyOn(friendsService, 'getUsersFriendship')
        .mockResolvedValue(friendship as Friends);
      const saveSpy = jest
        .spyOn(friendsRepository, 'save')
        .mockResolvedValue(undefined);

      await friendsService.deleteFriendship(userId, friendId);

      expect(saveSpy).toHaveBeenCalledWith({
        ...friendship,
        deletedAt: expect.any(Date),
      });
    });
  });

  describe('getNearbyFriends', () => {
    it('should get nearby friends for a user', async () => {
      const userId = 1;
      const userFriends = [
        { id: 1, user_id: userId, friend_id: 2 },
        { id: 2, user_id: userId, friend_id: 3 },
      ];

      jest
        .spyOn(friendsService, 'getUserFriends')
        .mockResolvedValue(userFriends as Friends[]);

      const result = await friendsService.getNearbyFriends(userId);

      expect(result).toEqual(userFriends);
    });
  });
});
