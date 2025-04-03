import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  public email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
  })
  public password: string;
}
