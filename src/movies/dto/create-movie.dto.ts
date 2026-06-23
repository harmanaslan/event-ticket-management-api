import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    example: 'Inception',
    description: 'Movie title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'A mind-bending thriller about dreams within dreams.',
    description: 'Movie description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 148,
    description: 'Movie duration in minutes',
  })
  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @ApiPropertyOptional({
    example: 'Sci-Fi',
    description: 'Movie genre',
  })
  @IsString()
  @IsOptional()
  genre?: string;
}
