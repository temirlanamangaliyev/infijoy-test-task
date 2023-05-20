import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './friends.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,
  ) {}

  createFriendship(userId: number, friendId: number) {
    const friendship = this.friendsRepository.create({
      user_id: userId,
      friend_id: friendId,
    });

    return this.friendsRepository.save(friendship);
  }

  getUserFriends(userId: number) {
    const friends = this.friendsRepository.find({ where: { user_id: userId } });
    console.log('friends', friends);

    return friends;
  }

  getUsersFriendship(userId: number, friendId: number) {
    const friendship = this.friendsRepository.findOne({
      where: {
        user_id: userId,
        friend_id: friendId,
        deletedAt: null, // Exclude already deleted friendship
      },
    });

    return friendship;
  }

  async deleteFriendship(userId: number, friendId: number) {
    const friendship = await this.getUsersFriendship(userId, friendId);

    return this.friendsRepository.save({
      ...friendship,
      deletedAt: new Date(),
    });
  }

  //TODO: mocks service
  async getNearbyFriends(userId, latitude, longitude) {
    const userFriends = await this.getUserFriends(userId);

    return userFriends.sort((user) => user.user_id);
  }
}
