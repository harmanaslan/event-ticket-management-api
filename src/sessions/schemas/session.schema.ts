import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({
  timestamps: true,
})
export class Session {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Movie',
  })
  movieId: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Hall',
  })
  hallId: Types.ObjectId;

  @Prop({
    required: true,
  })
  startTime: Date;

  @Prop({
    required: true,
  })
  endTime: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
