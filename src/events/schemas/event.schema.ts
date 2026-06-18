import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({
  timestamps: true,
})
export class Event {
  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  startDate: Date;

  @Prop({
    required: true,
    min: 0,
  })
  totalTickets: number;

  @Prop({
    required: true,
    min: 0,
  })
  availableTickets: number;

  @Prop({
    required: true,
    min: 0,
  })
  ticketPrice: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);