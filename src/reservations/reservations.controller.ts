import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsService } from './reservations.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email: string;
    role: string;
  };
};

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new reservation' })
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationsService.create(
      request.user.sub,
      createReservationDto,
    );
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my reservations' })
  findMy(@Req() request: AuthenticatedRequest) {
    return this.reservationsService.findMy(request.user.sub);
  }

  @Post(':id/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pay for a pending reservation' })
  pay(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.reservationsService.pay(request.user.sub, id);
  }
}
