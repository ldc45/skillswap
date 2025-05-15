import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: CreateUserDto, response: Response) {
    const user = await this.userService.create(signUpDto);
    const payload = { id: user.id, email: user.email } as JwtPayload;

    // Create tokens
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);

    // Define cookies
    this.setTokenCookies(response, accessToken, refreshToken);

    // Return tokens in response as well
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signIn(email: string, pass: string, response: Response) {
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

    // Create tokens
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);

    // Define cookies
    this.setTokenCookies(response, accessToken, refreshToken);

    // Return tokens in response as well
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  createAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  createRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  refreshToken(refreshToken: string, response: Response) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);

      // Create new access token
      const accessToken = this.createAccessToken(payload);

      // Define access token cookie (refresh token remains unchanged)
      this.setAccessTokenCookie(response, accessToken);

      // Return new token in response as well
      return {
        access_token: accessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  // Method for logout
  logout(response: Response) {
    // Clear the cookies for access and refresh tokens
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });
    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    return { message: 'Logout successful.' };
  }

  // Utility method to define token cookies
  private setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    this.setAccessTokenCookie(response, accessToken);
    this.setRefreshTokenCookie(response, refreshToken);
  }

  // Define cookie for access token
  private setAccessTokenCookie(response: Response, token: string) {
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });
  }

  // Define cookie for refresh token
  private setRefreshTokenCookie(response: Response, token: string) {
    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
  }
}
