import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { BaseRepository } from '../../commons/repositories/base.repository';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';

@Injectable()
export class TicketRepository extends BaseRepository<TicketDocument> {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {
    super(ticketModel);
  }

  async createWithSession(
    data: Partial<Ticket>,
    session: ClientSession,
  ): Promise<TicketDocument> {
    const createdTickets = await this.ticketModel.create([data], { session });
    return createdTickets[0];
  }
}