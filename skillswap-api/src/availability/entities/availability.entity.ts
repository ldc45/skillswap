import { ApiProperty } from '@nestjs/swagger';
import { Availability as PrismaAvailability } from '@prisma/client';
import { IsDate, IsInt, IsUUID } from 'class-validator';

export class Availability implements PrismaAvailability {
  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the availability',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 5,
    description:
      'The day of the week (0-6, where 0 is Sunday and 6 is Saturday)',
  })
  @IsInt()
  day: number;

  @ApiProperty({
    example: '10:00:00',
    description: 'Start time of the availability',
  })
  startTime: Date;

  @ApiProperty({
    example: '14:00:00',
    description: 'End time of the availability',
  })
  endTime: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the availability was created',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Date when the availability was last updated',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the user',
  })
  @IsUUID()
  userId: string;

  constructor(availability: PrismaAvailability) {
    this.id = availability.id;
    this.day = availability.day;
    this.startTime = availability.startTime;
    this.endTime = availability.endTime;
    this.createdAt = availability.createdAt;
    this.updatedAt = availability.updatedAt;
    this.userId = availability.userId;
  }
}
