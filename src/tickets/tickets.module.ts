import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { TicketRepository } from './repositories/ticket.repository';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, TicketRepository],
})
export class TicketsModule {}