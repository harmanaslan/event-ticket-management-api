import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateHallDto {
  @ApiProperty({
    example: 'Salon 1',
    description: 'Hall name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 10,
    description: 'Number of rows',
  })
  @IsNumber()
  @Min(1)
  rowCount: number;

  @ApiProperty({
    example: 12,
    description: 'Number of seats per row',
  })
  @IsNumber()
  @Min(1)
  seatsPerRow: number;
}
