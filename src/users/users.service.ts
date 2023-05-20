import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectRepository(Users) private repo: Repository<Users>) {}

  create(body): Promise<Users[]> {
    this.logger.log(`Creating user`);
    const user = this.repo.create(body);

    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find() {
    return this.repo.find();
  }

  async update(id: number, props: Partial<Users>): Promise<Users> {
    const user = await this.findOne(id);

    if (!user) {
      this.logger.error(`User with id ${id} ot found`);
      throw new NotFoundException('user not found!');
    }

    Object.assign(user, props);

    return this.repo.save(user);
  }

  async remove(id: number): Promise<Users> {
    const user = await this.findOne(id);
    if (!user) {
      this.logger.error(`User with id ${id} ot found`);
      throw new NotFoundException('user not found!');
    }

    return this.repo.remove(user);
  }
}
