import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Technology',
    description: 'The name of the category',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '#ffd700',
    description: 'The color of the category',
  })
  @IsOptional()
  @IsString()
  color: string | undefined;
}
