import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { BaseRepository } from '../../commons/repositories/base.repository';
import { Event, EventDocument } from '../schemas/event.schema';

@Injectable()
export class EventRepository extends BaseRepository<EventDocument> {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {
    super(eventModel);
  }

  async decreaseAvailableTickets(
    eventId: string,
    quantity: number,
    session: ClientSession,
  ): Promise<EventDocument | null> {
    return this.eventModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(eventId),
          availableTickets: {
            $gte: quantity,
          },
        },
        {
          $inc: {
            availableTickets: -quantity,
          },
        },
        {
          new: true,
          session,
        },
      )
      .exec();
  }
}