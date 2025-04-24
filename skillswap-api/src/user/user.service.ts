import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/types/jwt-payload';
import { RequestCookies } from '../auth/types/request-cookies';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserWithRelations } from './type/user-with-relations';

@Injectable()
export class UserService {
  private saltRounds = 10;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailUser = await this.findOneByMail(createUserDto.email);
    if (emailUser) {
      throw new BadRequestException('Email is already used.');
    }

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(randomNum: number = 0): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      include: {
        skills: {
          select: {
            skill: true,
          },
        },
        availabilities: {
          select: {
            id: true,
            day: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    if (randomNum > 0) {
      const randomUsers: UserWithRelations[] = [];
      for (let i = 0; i < randomNum; i++) {
        if (users.length <= 0) {
          break;
        }
        const randomIndex = Math.round(Math.random() * (users.length - 1));
        randomUsers.push(...users.splice(randomIndex, 1));
      }
      return plainToInstance(UserResponseDto, randomUsers);
    } else {
      return plainToInstance(UserResponseDto, users);
    }
  }

  async findOne(id: string): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        skills: {
          select: {
            skill: {
              select: {
                id: true,
                name: true,
                diminutive: true,
                categoryId: true,
              },
            },
          },
        },
        availabilities: {
          select: {
            id: true,
            day: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    if (!user) return null;

    return plainToInstance(UserResponseDto, user);
  }

  findOneByMail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findMe(request: Request): Promise<UserResponseDto> {
    const requestCookies = request.cookies as RequestCookies;
    const token = requestCookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('No token found in cookies.');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.findOne(payload.id);
      if (user) {
        return user;
      } else {
        throw new UnauthorizedException('User not found.');
      }
    } catch (error) {
      console.error("Couldn't verify token in method findMe:", error);
      throw new UnauthorizedException('Invalid or expired token.');
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
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
