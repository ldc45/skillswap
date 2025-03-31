import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.userService.findOneByMail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, email: user.email } as JwtPayload;
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
