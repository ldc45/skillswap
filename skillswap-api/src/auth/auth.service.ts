import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // TODO: await "findOneByMail" if necessary when Prisma models are done.
  async signIn(email: string, pass: string) {
    const user = this.userService.findOneByMail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
