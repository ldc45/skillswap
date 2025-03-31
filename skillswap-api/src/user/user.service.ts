import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// TODO: Change this to the real User class when I'm done re-learning NestJS
export type User = any;

@Injectable()
export class UserService {
  // TODO: Get users from Prisma once it's done
  private readonly users = [
    {
      id: 1,
      email: 'johndoe@email.com',
      password: 'changeme',
    },
    {
      id: 2,
      email: 'maria@email.com',
      password: 'guess',
    },
  ];

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }

  findOneByMail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
