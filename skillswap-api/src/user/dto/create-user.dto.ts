import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (minimum 8 characters)',
  })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: false,
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: false,
  })
  lastName: string;

  @ApiProperty({
    example: 'I am a web developer passionate about new technologies.',
    description: 'User biography',
    required: false,
  })
  biography: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  avatarUrl: string;
}
