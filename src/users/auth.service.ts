import { BadRequestException, Injectable } from '@nestjs/common';
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
}
