import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(
      signInDto.email,
      signInDto.password,
      response,
    );
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(
    @Body() signUpDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signUp(signUpDto, response);
  }

  @ApiOperation({ summary: 'Token refresh' })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Récupérer le refresh token depuis les cookies
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token manquant');
    }

    return this.authService.refreshToken(refreshToken, response);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      properties: {
        message: { type: 'string', example: 'Logout successful' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
