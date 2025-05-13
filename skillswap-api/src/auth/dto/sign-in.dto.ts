import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignInDto {
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
}