import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}