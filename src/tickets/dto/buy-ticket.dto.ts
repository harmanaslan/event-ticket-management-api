import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class BuyTicketDto {
  @ApiProperty({
    example: '6a343484329b9ca371510da6',
    description: 'ETKİNLİK ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    example: 'Yunus Harman',
    description: 'ALICI AD SOYAD',
  })
  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @ApiProperty({
    example: 'aslan@example.com',
    description: 'ALICI E-POSTA',
  })
  @IsEmail()
  @IsNotEmpty()
  buyerEmail: string;

  @ApiProperty({
    example: 2,
    description: 'ADET',
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}