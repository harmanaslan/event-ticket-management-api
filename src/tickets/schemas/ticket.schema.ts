import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({
  timestamps: true,
})
export class Ticket {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Event',
  })
  event: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  buyerName: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  buyerEmail: string;

  @Prop({
    required: true,
    min: 1,
  })
  quantity: number;

  @Prop({
    required: true,
    min: 0,
  })
  totalPrice: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);