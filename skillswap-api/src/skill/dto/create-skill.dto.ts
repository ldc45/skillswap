import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({
    example: 'Développeur web',
    description: 'Name of the skill',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Dev. web',
    description: 'Diminutive of the skill',
    type: String,
  })
  @IsString()
  @IsOptional()
  diminutive: string | null;

  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the category',
  })
  @IsUUID()
  categoryId: string;
}
