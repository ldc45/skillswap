import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMultipleUserSkillsDto {
  @ApiProperty({
    description: 'Array of skill IDs to add to user',
    example: [
      '12345678-1234-1234-1234-123456789012',
      '87654321-4321-4321-4321-210987654321',
    ],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  skillIds: string[];
}
