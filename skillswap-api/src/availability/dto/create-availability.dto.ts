import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Max, Min } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({
    example: 5,
    description:
      'The day of the week (0-6, where 0 is Sunday and 6 is Saturday)',
  })
  @IsInt()
  @Min(0)
  @Max(6)
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
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the user',
  })
  @IsUUID()
  userId: string;
}
