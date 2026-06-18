import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { TicketsService } from './tickets.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('buy')
  @ApiOperation({ summary: 'Buy ticket for an event' })
  buyTicket(@Body() buyTicketDto: BuyTicketDto) {
    return this.ticketsService.buyTicket(buyTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets' })
  findAll() {
    return this.ticketsService.findAll();
  }
}