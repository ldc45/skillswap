import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class User implements PrismaUser {
  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the user',
  })
  id: string;

  @ApiProperty({
    example: 'dupont.marie@gmail.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description:
      'User password (minimum 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character)',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'Marie',
    description: 'User first name',
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    example: 'Dupont',
    description: 'User last name',
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    example: 'I am a web developer passionate about new technologies.',
    description: 'User biography',
    required: false,
    type: String, // This line is necessary to type the property as a string
  })
  @IsOptional()
  @IsString()
  biography: string | null;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
    type: String, // This line is necessary to type the property as a string
  })
  @IsOptional()
  @IsString()
  avatarUrl: string | null;

  @ApiProperty({
    example: false,
    description: 'Indicates if the user account is archived',
  })
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the user was created',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the user was last updated',
  })
  @IsDate()
  updatedAt: Date;

  constructor(user: PrismaUser) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.biography = user.biography;
    this.avatarUrl = user.avatarUrl;
    this.isArchived = user.isArchived;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
