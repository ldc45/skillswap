import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: CreateUserDto) {
    const user = await this.userService.create(signUpDto);
    const payload = { id: user.id, email: user.email } as JwtPayload;
    return {
      access_token: this.createAccessToken(payload),
      refresh_token: this.createRefreshToken(payload),
    };
  }

  async signIn(email: string, pass: string) {
    const user = await this.userService.findOneByMail(email);
    if (!user) {
      throw new UnauthorizedException();
    } else {
      const isPassCorrect = await bcrypt.compare(pass, user.password);
      if (!isPassCorrect) {
        throw new UnauthorizedException();
      }
    }

    const payload = { id: user.id, email: user.email } as JwtPayload;
    return {
      access_token: this.createAccessToken(payload),
      refresh_token: this.createRefreshToken(payload),
    };
  }

  createAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  createRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify<JwtPayload>(refreshToken);
    return {
      access_token: this.createAccessToken(payload),
    };
  }
}
