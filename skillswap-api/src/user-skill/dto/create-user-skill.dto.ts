import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSkillDto {
  @ApiProperty({
    description: 'ID of the skill to add to user',
    example: '12345678-1234-1234-1234-123456789012',
  })
  @IsNotEmpty()
  @IsUUID()
  skillId: string;
}
