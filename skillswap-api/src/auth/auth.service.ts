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

    // Créer les tokens
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);

    // Définir les cookies
    this.setTokenCookies(response, accessToken, refreshToken);

    // Retourner également les tokens dans la réponse
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

    // Créer les tokens
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);

    // Définir les cookies
    this.setTokenCookies(response, accessToken, refreshToken);

    // Retourner également les tokens dans la réponse
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

      // Créer un nouveau token d'accès
      const accessToken = this.createAccessToken(payload);

      // Définir le cookie pour le token d'accès (refresh token reste inchangé)
      this.setAccessTokenCookie(response, accessToken);

      // Retourner également le token dans la réponse
      return {
        access_token: accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }

  // Methode for logout
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

    return { message: 'Déconnexion réussie' };
  }

  // Méthode utilitaire pour définir les cookies de token
  private setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    this.setAccessTokenCookie(response, accessToken);
    this.setRefreshTokenCookie(response, refreshToken);
  }

  // Définir le cookie pour le token d'accès
  private setAccessTokenCookie(response: Response, token: string) {
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes en milliseconds
    });
  }

  // Définir le cookie pour le token de rafraîchissement
  private setRefreshTokenCookie(response: Response, token: string) {
    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en milliseconds
    });
  }
}
