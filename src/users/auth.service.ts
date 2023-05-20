import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(body) {
    const users = await this.usersService.find(body.email);
    if (users.length) {
      throw new BadRequestException('email is already in use !');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(body.password, salt, 32)) as Buffer;

    const hashedPassword = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create({
      ...body,
      password: hashedPassword,
    });

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found!');
    }

    const [salt, savedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (savedHash !== hash.toString('hex')) {
      throw new NotFoundException('bad password!');
    }

    return user;
  }
}
