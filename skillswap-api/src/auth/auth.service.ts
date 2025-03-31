import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) { }

  // TODO: Add "async" and await "findOneByMail" if necessary when Prisma models are done.
  signIn(email: string, pass: string) {
    const user = this.userService.findOneByMail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;

    // TODO: Generate a JWT and return it here.
    // For now, return user object.
    return result;
  }
}
