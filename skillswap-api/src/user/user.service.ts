import {
  BadRequestException,
  Inject,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  private saltRounds = 10;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const emailUser = await this.findOneByMail(createUserDto.email);
    if (emailUser) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    // Create user with hashed password
    const createdUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      include: {
        skills: {
          select: {
            skill: true,
          },
        },
        availabilities: true,
      },
    });

    // Clear user cache after creating a new user
    await this.cacheManager.del('users');

    // Return the created user as a DTO
    return plainToInstance(UserResponseDto, createdUser);
  }

  async findAll(randomNum: number = 0): Promise<UserResponseDto[]> {
    // Try to get from cache first
    const cachedUsers = await this.cacheManager.get<UserResponseDto[]>('users');

    if (cachedUsers) {
      return cachedUsers;
    }

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
      // Store in cache
      await this.cacheManager.set('users', users);
      return plainToInstance(UserResponseDto, users);
    }
  }

  async findOne(id: string): Promise<UserResponseDto | null> {
    // Get cached users
    const cacheUsers: UserWithRelations[] | null =
      await this.cacheManager.get('users');

    // If there is cache & demanded user is in it, filter and return it
    if (cacheUsers) {
      const cacheUser: UserWithRelations = cacheUsers.filter((usr) => {
        return usr.id === id;
      })[0];

      if (cacheUser) {
        return plainToInstance(UserResponseDto, cacheUser);
      }
    }

    // Otherwise, fetch from Prisma and return
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Hash password if provided
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        this.saltRounds,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
      include: {
        skills: {
          select: {
            skill: true,
          },
        },
        availabilities: true,
      },
    });
    // Delete users cache to force re-fetch
    await this.cacheManager.del('users');

    // Conversion en DTO de réponse pour exclure le mot de passe
    return plainToInstance(UserResponseDto, updatedUser);
  }

  async remove(id: string) {
    const deletedUser = await this.prisma.user.delete({
      where: {
        id: id,
      },
      include: {
        skills: {
          select: {
            skill: true,
          },
        },
        availabilities: true,
      },
    });
    // Delete users cache to force re-fetch
    await this.cacheManager.del('users');

    return plainToInstance(UserResponseDto, deletedUser);
  }
}
