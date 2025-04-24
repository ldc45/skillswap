import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class AvailabilityResponseDto {
  @ApiProperty({
    example: 'aaa11bbb-2222-cccc-3333-ddddd4444eee',
    description: 'Unique identifier for the availability',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 5,
    description:
      'The day of the week (0-6, where 0 is Sunday and 6 is Saturday)',
  })
  @Expose()
  @IsInt()
  @Min(0)
  @Max(6)
  day: number;

  @ApiProperty({
    example: '10:00:00',
    description: 'Start time of the availability',
  })
  @Expose()
  startTime: Date;

  @ApiProperty({
    example: '14:00:00',
    description: 'End time of the availability',
  })
  @Expose()
  endTime: Date;
}
