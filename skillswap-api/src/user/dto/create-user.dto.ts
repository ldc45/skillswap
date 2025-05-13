import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString, Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!@#',
    description: 'User password (minimum 12 characters, must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character)',
  })
  @IsString()
  @MinLength(12, {
    message: 'Le mot de passe doit contenir au moins 12 caractères'
  })
  @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      {
        message:
            'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial',
      }
  )
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'I am a web developer passionate about new technologies.',
    description: 'User biography',
    required: false,
  })
  @IsOptional()
  @IsString()
  biography: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the user account is archived',
  })
  @IsOptional()
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl: string;
}
