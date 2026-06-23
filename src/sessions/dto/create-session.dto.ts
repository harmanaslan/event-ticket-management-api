import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({
    example: '68a3442f30b50f94f3707a0c5',
    description: 'Movie ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  movieId: string;

  @ApiProperty({
    example: '68a3442f30b50f94f3707a0c6',
    description: 'Hall ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  hallId: string;

  @ApiProperty({
    example: '2026-07-01T19:00:00.000Z',
    description: 'Session start time',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    example: '2026-07-01T21:30:00.000Z',
    description: 'Session end time',
  })
  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}
