import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    example: '68a3442f30b50f94f3707a0c5',
    description: 'Session ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    example: 'A1',
    description: 'Seat code',
  })
  @IsString()
  @IsNotEmpty()
  seatCode: string;
}
