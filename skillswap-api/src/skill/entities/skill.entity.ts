import { ApiProperty } from '@nestjs/swagger';
import { Skill as PrismaSkill } from '@prisma/client';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class Skill implements PrismaSkill {
  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the skill',
  })
  id: string;

  @ApiProperty({
    example: 'Développeur web',
    description: 'Name of the skill',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Dev. web',
    description: 'Diminutive of the skill',
  })
  @IsString()
  @IsOptional()
  diminutive: string | null;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the skill was created',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the skill was last updated',
  })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the category',
  })
  categoryId: string;

  constructor(skill: PrismaSkill) {
    this.id = skill.id;
    this.name = skill.name;
    this.diminutive = skill.diminutive;
    this.createdAt = skill.createdAt;
    this.updatedAt = skill.updatedAt;
    this.categoryId = skill.categoryId;
  }
}
