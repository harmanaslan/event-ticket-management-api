import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectConnection, InjectModel } from '@nestjs/mongoose';
  import { ClientSession, Connection, Model, Types } from 'mongoose';
  import { Event, EventDocument } from '../events/schemas/event.schema';
  import { BuyTicketDto } from './dto/buy-ticket.dto';
  import { TicketRepository } from './repositories/ticket.repository';
  
  @Injectable()
  export class TicketsService {
    private readonly logger = new Logger(TicketsService.name);

    constructor(
      private readonly ticketRepository: TicketRepository,
  
      @InjectModel(Event.name)
      private readonly eventModel: Model<EventDocument>,
  
      @InjectConnection()
      private readonly connection: Connection,
    ) {}
  
    async buyTicket(buyTicketDto: BuyTicketDto) {
      const session: ClientSession = await this.connection.startSession();
  
      session.startTransaction();
  
      try {
        const event = await this.eventModel
          .findOneAndUpdate(
            {
              _id: new Types.ObjectId(buyTicketDto.eventId),
              availableTickets: {
                $gte: buyTicketDto.quantity,
              },
            },
            {
              $inc: {
                availableTickets: -buyTicketDto.quantity,
              },
            },
            {
              new: true,
              session,
            },
          )
          .exec();
  
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
  
        if (
          error instanceof BadRequestException ||
          error instanceof NotFoundException
        ) {
          throw error;
        }
  
        throw new BadRequestException('Bilet satin alma islemi basarisiz oldu');
      } finally {
        await session.endSession();
      }
    }
  
    async findAll() {
      return this.ticketRepository.find();
    }
  }