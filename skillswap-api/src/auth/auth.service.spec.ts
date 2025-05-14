import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { JwtPayload } from './types/jwt-payload';
import { Response } from 'express';

describe('AuthService', () => {
  let service: AuthService;

  // Mock Express response object
  const mockResponse: Partial<Response> = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  // Service mocks
  const mockUserService = {
    create: jest.fn(),
    findOneByMail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  // Common test data
  const testEmail = 'test@example.com';
  const testPassword = 'Password123!';
  const testUserId = 'user-id-123';
  const testPayload: JwtPayload = { id: testUserId, email: testEmail };
  const testAccessToken = 'access-token-xxx';
  const testRefreshToken = 'refresh-token-xxx';

  beforeEach(async () => {
    // Initialize NestJS testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {

    const createUserDto: CreateUserDto = {
      email: testEmail,
      password: testPassword,
      firstName: 'John',
      lastName: 'Doe',
      biography: '',
      isArchived: false,
      avatarUrl: '',
    };

    it('should create a user, generate tokens, set cookies and return tokens', async () => {
      // Arrange
      const userResponseDto = new UserResponseDto();
      userResponseDto.id = testUserId;
      userResponseDto.email = testEmail;

      // Mock the user creation and token generation
      mockUserService.create.mockResolvedValue(userResponseDto);
      // Mock the JWT service to return test tokens
      mockJwtService.sign
        .mockReturnValueOnce(testAccessToken)
        .mockReturnValueOnce(testRefreshToken);

      // Act
      const result = await service.signUp(
        createUserDto,
        mockResponse as Response,
      );

      // Assert
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        access_token: testAccessToken,
        refresh_token: testRefreshToken,
      });
    });
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      mockUserService.findOneByMail.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.signIn(testEmail, testPassword, mockResponse as Response),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Arrange
      const user = {
        id: testUserId,
        email: testEmail,
        password: 'hashed-password',
      };
      mockUserService.findOneByMail.mockResolvedValue(user);

      // Mock bcrypt.compare to return false (incorrect password)
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.signIn(testEmail, testPassword, mockResponse as Response),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should generate tokens, set cookies and return tokens if credentials are valid', async () => {
      // Arrange
      const user = {
        id: testUserId,
        email: testEmail,
        password: 'hashed-password',
      };
      mockUserService.findOneByMail.mockResolvedValue(user);

      // Mock bcrypt.compare to return true (correct password)
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

      mockJwtService.sign
        .mockReturnValueOnce(testAccessToken)
        .mockReturnValueOnce(testRefreshToken);

      // Act
      const result = await service.signIn(
        testEmail,
        testPassword,
        mockResponse as Response,
      );

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(testPassword, user.password);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        access_token: testAccessToken,
        refresh_token: testRefreshToken,
      });
    });
  });

  describe('createAccessToken', () => {
    it('should create an access token with 15m expiration', () => {
      // Arrange
      mockJwtService.sign.mockReturnValue(testAccessToken);

      // Act
      const result = service.createAccessToken(testPayload);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith(testPayload, {
        expiresIn: '15m',
      });
      expect(result).toBe(testAccessToken);
    });
  });

  describe('createRefreshToken', () => {
    it('should create a refresh token with 7d expiration', () => {
      // Arrange
      mockJwtService.sign.mockReturnValue(testRefreshToken);

      // Act
      const result = service.createRefreshToken(testPayload);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith(testPayload, {
        expiresIn: '7d',
      });
      expect(result).toBe(testRefreshToken);
    });
  });

  describe('refreshToken', () => {
    it('should throw UnauthorizedException if token verification fails', () => {
      // Arrange
      // Simulate a token verification error (e.g., expired or invalid token)
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      // Call the method and verify that the expected exception is thrown
      expect(() => {
        service.refreshToken(testRefreshToken, mockResponse as Response);
      }).toThrow(UnauthorizedException);

      // Assert
      // Ensure that verify was called with the correct token
      expect(mockJwtService.verify).toHaveBeenCalledWith(testRefreshToken);
    });


    it('should create a new access token and set access token cookie', () => {
      // Arrange
      mockJwtService.verify.mockReturnValue(testPayload);
      mockJwtService.sign.mockReturnValue(testAccessToken);

      // Act
      const result = service.refreshToken(
        testRefreshToken,
        mockResponse as Response,
      );

      // Assert
      expect(mockJwtService.verify).toHaveBeenCalledWith(testRefreshToken);
      expect(mockJwtService.sign).toHaveBeenCalledWith(testPayload, {
        expiresIn: '15m',
      });
      expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        access_token: testAccessToken,
      });
    });
  });

  describe('logout', () => {
    it('should clear access and refresh token cookies', () => {
      // Act
      const result = service.logout(mockResponse as Response);

      // Assert
      // Verify both cookies are properly cleared
      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.any(Object),
      );
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.any(Object),
      );
      expect(result).toEqual({ message: 'Logout successful.' });
    });
  });
});
