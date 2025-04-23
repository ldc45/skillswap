import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

import { AvailabilityResponseDto } from '../../availability/dto/availability-response.dto';
import { SkillResponseDto } from '../../skill/dto/skill-response.dto';

export class UserResponseDto {
  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the user',
  })
  @Expose() // We expose this field for transformation
  id: string;

  @ApiProperty({
    example: 'dupont.marie@gmail.com',
    description: 'User email address',
  })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description:
      'User password (minimum 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character)',
    required: false,
  })
  @Exclude()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Marie',
    description: 'User first name',
  })
  @Expose()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Dupont',
    description: 'User last name',
  })
  @Expose()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'I am a web developer passionate about new technologies.',
    description: 'User biography',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  biography: string | null;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  @Expose()
  @IsOptional()
  @IsString()
  avatarUrl: string | null;

  @ApiProperty({
    example: false,
    description: 'Indicates if the user account is archived',
  })
  @Expose()
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the user was created',
  })
  @Exclude()
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the user was last updated',
  })
  @Exclude()
  @IsDate()
  updatedAt: Date;

  // Nested properties with arrays of availabilities and skills
  @ApiProperty({
    type: [AvailabilityResponseDto],
    description: 'List of user availabilities',
  })
  @Expose()
  @Type(() => AvailabilityResponseDto) // Uses class-transformer to convert each element to AvailabilityResponseDto
  availabilities: AvailabilityResponseDto[];

  @Expose()
  @Type(() => SkillResponseDto)
  @Transform(
    ({ value }) => {
      if (Array.isArray(value)) {
        return value.map((item: { skill: SkillResponseDto }) => item.skill);
      }
      return [];
    },
    { toClassOnly: true },
  )
  skills: SkillResponseDto[];
}
