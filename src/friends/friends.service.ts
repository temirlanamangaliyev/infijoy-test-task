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

  addUsersToFriends(userId: number, friendId: number) {
    const result = this.friendsRepository.create({
      user_id: userId,
      friend_id: friendId,
    });

    return result;
  }

  getUserFriends(userId: number) {
    const friends = this.friendsRepository.find({ where: { user_id: userId } });

    return friends;
  }

  //TODO: mocks service
  async getNearbyFriends(userId, latitude, longitude) {
    const userFriends = await this.getUserFriends(userId);

    return userFriends.sort((user) => user.user_id);
  }
}
