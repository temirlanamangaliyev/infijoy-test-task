import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  NotFoundException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { SerializeInterceptors } from '../interceptors/serialize.interceptors';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { UsersService } from './users.service';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @UseGuards(AuthorizationGuard)
  @Post('/')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.userService.create(body);
    return user;
  }

  @UseInterceptors(SerializeInterceptors) // using interceptor in order to show only fields that is required from doc
  @Get('/:id')
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
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
