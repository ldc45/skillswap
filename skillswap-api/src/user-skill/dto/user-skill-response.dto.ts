import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserSkillResponseDto {
  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the user',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the skill',
  })
  @Expose()
  skillId: string;
}
