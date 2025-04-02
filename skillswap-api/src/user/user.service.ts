import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/types/jwt-payload';

@Injectable()
export class UserService {
  private saltRounds = 10;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  findOneByMail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findMe(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      try {
        const payload = this.jwtService.verify<JwtPayload>(token);
        const user = await this.findOne(payload.id);
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...data } = user;
          return data;
        } else {
          throw new UnauthorizedException();
        }
      } catch {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
