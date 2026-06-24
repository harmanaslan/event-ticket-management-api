import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReservationStatus } from '../enums/reservation-status.enum';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({
  timestamps: true,
})
export class Reservation {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Session',
  })
  sessionId: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    uppercase: true,
  })
  seatCode: string;

  @Prop({
    required: true,
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Prop({
    required: true,
  })
  expiresAt: Date;

  @Prop()
  paidAt?: Date;

  @Prop()
  cancelledAt?: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.index(
  { sessionId: 1, seatCode: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['PENDING', 'PAID'] },
    },
  },
);
