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
import { AuthGuard } from '@nestjs/passport';
import { RelationshipsService } from 'src/relationships/relationships.service';
import { CreateRelationDto } from 'src/relationships/create-relation.dto';
import { FriendsService } from 'src/friends/friends.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private relationshipsService: RelationshipsService,
    private friendsService: FriendsService,
  ) {}

  @ApiOperation({
    summary: 'Create a user',
    description: 'Creates a new user.',
  })
  @ApiOkResponse({ type: User })
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  @Post('/')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);
    return user;
  }

  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Returns a user based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @UseInterceptors(SerializeInterceptors)
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

  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users.',
  })
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  @UseInterceptors(SerializeInterceptors)
  @Get()
  findAllUsers() {
    return this.userService.find();
  }

  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes a user based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates a user based on the provided ID and properties.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @Patch('/:id')
  @ApiOkResponse({ type: UpdateUserDto })
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @ApiOperation({
    summary: "Get a user's relationships",
    description:
      'Returns all relationships of a user based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @Get('/:id/relationships')
  getUsersRelationships(@Param('id') id: number) {
    id;
    return this.relationshipsService.getAllUserRelationships();
  }

  @ApiOperation({
    summary: "Get a user's followers",
    description: 'Returns the followers of a user based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @Get('/:id/relationships/followers')
  getUserFollowers(@Param('id') id: number) {
    return this.relationshipsService.getUserFollowers(id);
  }

  @ApiOperation({
    summary: "Get a user's followings",
    description: 'Returns the followings of a user based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @Get('/:id/relationships/following')
  getUserFollowings(@Param('id') id: number) {
    return this.relationshipsService.getUserFollowings(id);
  }

  @ApiOperation({
    summary: 'Add a follower to a user',
    description: 'Creates a relationship between a user and a follower.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiOkResponse({ type: CreateRelationDto })
  @Post('/:id/relationships/followers')
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

  @ApiOperation({
    summary: 'Remove a follower from a user',
    description: 'Removes the relationship between a user and a follower.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiParam({ name: 'followerId', description: 'Follower ID', type: 'number' })
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

  @ApiOperation({
    summary: 'Add a user to a following',
    description: 'Creates a relationship between a follower and a user.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiOkResponse({ type: CreateRelationDto })
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  @Post('/:id/relationships/following')
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

  @ApiOperation({
    summary: 'Remove a user from followers',
    description: 'Removes the relationship between a follower and a user.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiParam({ name: 'userId', description: 'User ID', type: 'number' })
  @Delete('/:id/relationships/followers/:userId')
  async removeUserFromFollowers(
    @Param('id') id: number,
    @Param('userId') userId: number,
  ) {
    const relation = await this.relationshipsService.removeRelation(userId, id);
    return relation;
  }

  @ApiOperation({
    summary: "Get a user's friends",
    description: 'Returns the friends of a user based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @Get('/:id/friends')
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserFriends(@Param('id') id: number) {
    const userFriends = await this.friendsService.getUserFriends(id);

    return userFriends;
  }

  //TODO: make logic for finding nearby friends
  @ApiOperation({
    summary: 'Get nearby friends',
    description:
      'Returns the nearby friends of a user based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @Get('/:id/nearby-friends')
  async getNearbyFriends(@Param('id') id: number) {
    const nearbyFriends = await this.friendsService.getNearbyFriends(id);

    return nearbyFriends;
  }
}
