import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { IsAdvancedDate } from '../../commons/validators/is-advanced-date.validator';

export class CreateEventDto {
  @ApiProperty({
    example: 'NestJS Workshop',
    description: 'Event title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A hands-on NestJS workshop for backend developers',
    description: 'Event description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '2026-07-01T19:00:00.000Z',
    description: 'Event start date. Must be at least 3 days after today.',
  })
  @IsDateString()
  @IsAdvancedDate()
  startDate: string;

  @ApiProperty({
    example: 100,
    description: 'Total ticket count for the event',
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  totalTickets: number;

  @ApiProperty({
    example: 250,
    description: 'Ticket price',
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  ticketPrice: number;
}