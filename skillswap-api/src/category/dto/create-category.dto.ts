import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
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
}
