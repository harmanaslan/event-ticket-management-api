import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    Logger,
  } from '@nestjs/common';
  import { InjectConnection } from '@nestjs/mongoose';
  import { ClientSession, Connection } from 'mongoose';
  import { EventRepository } from '../events/repositories/event.repository';
  import { BuyTicketDto } from './dto/buy-ticket.dto';
  import { TicketRepository } from './repositories/ticket.repository';
  
  @Injectable()
  export class TicketsService {
    private readonly logger = new Logger(TicketsService.name);

    constructor(
      private readonly ticketRepository: TicketRepository,
      private readonly eventRepository: EventRepository,
  
      @InjectConnection()
      private readonly connection: Connection,
    ) {}
  
    async buyTicket(buyTicketDto: BuyTicketDto) {
      const session: ClientSession = await this.connection.startSession();
  
      session.startTransaction();
  
      try {
        const event = await this.eventRepository.decreaseAvailableTickets(
          buyTicketDto.eventId,
          buyTicketDto.quantity,
          session,
        );
  
        if (!event) {
          throw new BadRequestException('Etkinlik bulunamadi veya yeterli bilet yok');
        }
  
        const totalPrice = event.ticketPrice * buyTicketDto.quantity;
  
        const ticket = await this.ticketRepository.createWithSession(
          {
            event: event._id,
            buyerName: buyTicketDto.buyerName,
            buyerEmail: buyTicketDto.buyerEmail,
            quantity: buyTicketDto.quantity,
            totalPrice,
          },
          session,
        );
  
        await session.commitTransaction();
  
        return {
          ticket,
          event,
        };
      } catch (error) {
        this.logger.error(
          'Bilet satin alma islemi basarisiz oldu',
          error instanceof Error ? error.stack : String(error),
        );

        await session.abortTransaction();
  
        if (error instanceof HttpException) {
          throw error;
        }
  
        throw new InternalServerErrorException(
          'Bilet satin alma islemi basarisiz oldu',
        );
      } finally {
        await session.endSession();
      }
    }
  
    async findAll() {
      return this.ticketRepository.find();
    }
  }