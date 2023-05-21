import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepo: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepo = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'Tima',
        dob: new Date(),
        address: 'address',
        description: 'description',
      };

      const createdUser = {
        id: 1,
        name: 'Tima',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
        followers: [],
        following: [],
        friends: [],
        friendOf: [],
      } as Users;

      jest.spyOn(usersRepo, 'create').mockReturnValue(createdUser);
      jest.spyOn(usersRepo, 'save').mockResolvedValue(createdUser);

      const result = await usersService.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(usersRepo.create).toBeCalledWith(createUserDto);
      expect(usersRepo.save).toBeCalledWith(createdUser);
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const userId = 1;

      const foundUser = {
        id: 1,
        name: 'Tima',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
        followers: [],
        following: [],
        friends: [],
        friendOf: [],
      } as Users;

      jest.spyOn(usersRepo, 'findOneBy').mockResolvedValue(foundUser);

      const result = await usersService.findOne(userId);

      expect(result).toEqual(foundUser);
      expect(usersRepo.findOneBy).toBeCalledWith({ id: userId });
    });
  });

  describe('find', () => {
    it('should find all users', async () => {
      const foundUsers = [
        {
          id: 1,
          name: 'Tima',
          dob: new Date(),
          address: 'address',
          description: 'description',
          createdAt: new Date(),
          followers: [],
          following: [],
          friends: [],
          friendOf: [],
        },
        {
          id: 2,
          name: 'Tima',
          dob: new Date(),
          address: 'address',
          description: 'description',
          createdAt: new Date(),
          followers: [],
          following: [],
          friends: [],
          friendOf: [],
        },
      ] as Users[];

      jest.spyOn(usersRepo, 'find').mockResolvedValue(foundUsers);

      const result = await usersService.find();

      expect(result).toEqual(foundUsers);
      expect(usersRepo.find).toBeCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto = { name: 'Tima2' };

      const foundUser = {
        id: 1,
        name: 'Tima',
        dob: new Date(),
        address: 'address',
        description: 'description',
        createdAt: new Date(),
        followers: [],
        following: [],
        friends: [],
        friendOf: [],
      } as Users;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(foundUser);
      jest.spyOn(usersRepo, 'save').mockResolvedValue(foundUser);

      const result = await usersService.update(userId, updateUserDto);

      expect(result).toEqual(foundUser);
      expect(usersService.findOne).toBeCalledWith(userId);
      expect(usersRepo.save).toBeCalledWith({ ...foundUser, ...updateUserDto });
    });

    it('should throw NotFoundException when user is not found', async () => {
      const userId = 1;
      const updateUserDto = { name: 'John Smith' };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(undefined);

      await expect(
        usersService.update(userId, updateUserDto),
      ).rejects.toThrowError(NotFoundException);
      expect(usersService.findOne).toBeCalledWith(userId);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;

      const foundUser = new Users();
      foundUser.id = userId;
      foundUser.name = 'Tima';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(foundUser);
      jest.spyOn(usersRepo, 'remove').mockResolvedValue(foundUser);

      const result = await usersService.remove(userId);

      expect(result).toEqual(foundUser);
      expect(usersService.findOne).toBeCalledWith(userId);
      expect(usersRepo.remove).toBeCalledWith(foundUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const userId = 1;

      jest.spyOn(usersService, 'findOne').mockResolvedValue(undefined);

      await expect(usersService.remove(userId)).rejects.toThrowError(
        NotFoundException,
      );
      expect(usersService.findOne).toBeCalledWith(userId);
    });
  });
});
