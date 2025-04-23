import { ApiProperty } from '@nestjs/swagger';

export class UserSkillResponseDto {
  @ApiProperty({
    description: 'ID of the user',
    example: '12345678-1234-1234-1234-123456789012',
  })
  userId: string;

  @ApiProperty({
    description: 'ID of the skill',
    example: '12345678-1234-1234-1234-123456789012',
  })
  skillId: string;

  @ApiProperty({
    description: 'Name of the skill',
    example: 'JavaScript',
  })
  skillName: string;

  @ApiProperty({
    description: 'Diminutive of the skill',
    example: 'JS',
    required: false,
  })
  skillDiminutive?: string;

  @ApiProperty({
    description: 'ID of the category',
    example: '12345678-1234-1234-1234-123456789012',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Programming',
  })
  categoryName: string;

  @ApiProperty({
    description: 'Color of the category',
    example: '#FF5733',
    required: false,
  })
  categoryColor?: string;
}
