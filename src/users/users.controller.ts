import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  NotFoundException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { SerializeInterceptors } from '../interceptors/serialize.interceptors';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto as User } from './dtos/user.dto';
import { UsersService } from './users.service';
import { Friends } from 'src/friends/friends.entity';
import { AuthGuard } from '@nestjs/passport';
import { RelationshipsService } from 'src/relationships/relationships.service';
import { CreateRelationDto } from 'src/relationships/create-relation.dto';
import { FriendsService } from 'src/friends/friends.service';
import { ApiTags, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private relationshipsService: RelationshipsService,
    private friendsService: FriendsService,
  ) {}

  // @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ type: User })
  @Post('/')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);
    return user;
  }

  @UseInterceptors(SerializeInterceptors) // using interceptor in order to show only fields that is required from doc
  @Get('/:id')
  @ApiOkResponse({ type: User, isArray: true })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @UseInterceptors(SerializeInterceptors)
  @Get()
  findAllUsers() {
    return this.userService.find();
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  @ApiOkResponse({ type: UpdateUserDto })
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Get('/:id/relationships')
  getUsersRelationships(@Param('id') id: number) {
    id;
    return this.relationshipsService.getAllUserRelationships();
  }

  @Get('/:id/relationships/followers')
  getUserFollowers(@Param('id') id: number) {
    return this.relationshipsService.getUserFollowers(id);
  }

  @Get('/:id/relationships/following')
  getUserFollowings(@Param('id') id: number) {
    return this.relationshipsService.getUserFollowings(id);
  }

  @Post('/:id/relationships/followers')
  @ApiOkResponse({ type: CreateRelationDto })
  async addUserToFollower(
    @Param('id') id: number,
    @Body() body: CreateRelationDto,
  ) {
    const relation = await this.relationshipsService.createUserRelation(
      id,
      body.followerId,
    );
    return relation;
  }

  @Delete('/:id/relationships/followers/:followerId')
  async removeUserFromFollowing(
    @Param('id') id: number,
    @Param('followerId') followerId: number,
  ) {
    const relation = await this.relationshipsService.removeRelation(
      id,
      followerId,
    );
    return relation;
  }

  @Post('/:id/relationships/following')
  @ApiOkResponse({ type: CreateRelationDto })
  async addUserToFollowing(
    @Param('id') id: number,
    @Body() body: CreateRelationDto,
  ) {
    const relation = await this.relationshipsService.createUserRelation(
      body.followerId,
      id,
    );
    return relation;
  }

  @Delete('/:id/relationships/followers/:userId')
  async removeUserFromFollowers(
    @Param('id') id: number,
    @Param('userId') userId: number,
  ) {
    const relation = await this.relationshipsService.removeRelation(userId, id);
    return relation;
  }

  @Get('/:id/friends')
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserFriends(@Param('id') id: number) {
    const userFriends = await this.friendsService.getUserFriends(id);

    return userFriends;
  }

  //TODO: make logic for finding nearby friends
  @Get('/:id/nearby-friends')
  async getNearbyFriends(@Param('id') id: number) {
    const nearbyFriends = await this.friendsService.getNearbyFriends(id);

    return nearbyFriends;
  }
}
