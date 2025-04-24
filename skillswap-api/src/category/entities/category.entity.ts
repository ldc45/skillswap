import { ApiProperty } from '@nestjs/swagger';
import { Category as PrismaCategory } from '@prisma/client';
import {
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class Category {
  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the category',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'Technology',
    description: 'The name of the category',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '#ffd700',
    description: 'The color of the category in hex code',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color: string | null;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the category was created',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the category was last updated',
  })
  updatedAt: Date;

  constructor(category: PrismaCategory) {
    this.id = category.id;
    this.name = category.name;
    this.color = category.color;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
