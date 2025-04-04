import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/types/jwt-payload';
import { RequestCookies } from '../auth/types/request-cookies';

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

  async findAll(randomNum: number = 0): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    if (randomNum > 0) {
      const randomUsers: User[] = [];
      const usedIndexes: number[] = [];
      for (let i = 0; i < randomNum; i++) {
        let isPicked = false;
        while (!isPicked) {
          const randomIndex = Math.round(Math.random() * (users.length - 1));
          if (!usedIndexes.includes(randomIndex)) {
            usedIndexes.push(randomIndex);
            randomUsers.push(users[randomIndex]);
            isPicked = true;
          }
        }
      }
      return randomUsers;
    } else {
      return users;
    }
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
    const requestCookies = request.cookies as RequestCookies;
    const token = requestCookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Aucun token trouvé dans les cookies');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = (await this.findOne(payload.id)) as Partial<User>;
      if (user) {
        delete user.password;
        return user;
      } else {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
    } catch (error) {
      console.error('Erreur de vérification du token dans findMe:', error);
      throw new UnauthorizedException('Token invalide ou expiré');
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
