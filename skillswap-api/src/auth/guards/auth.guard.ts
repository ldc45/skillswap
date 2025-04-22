import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload';
import { RequestCookies } from '../types/request-cookies';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('No token found in cookies.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      // Ajouter le payload décodé à la requête pour une utilisation ultérieure
      request['user'] = payload;
    } catch (error) {
      console.error(
        'An error occurred while verifying token in AuthGuard:',
        error,
      );
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const requestCookies = request.cookies as RequestCookies;
    return requestCookies?.access_token;
  }
}
