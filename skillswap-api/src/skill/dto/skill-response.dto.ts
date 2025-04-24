import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class SkillResponseDto {
  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the skill',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'Développeur web',
    description: 'Name of the skill',
  })
  @Expose()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Dev. web',
    description: 'Diminutive of the skill',
    type: String,
  })
  @Expose()
  @IsString()
  @IsOptional()
  diminutive: string | null;

  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the category',
  })
  @Expose()
  @IsUUID()
  categoryId: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
