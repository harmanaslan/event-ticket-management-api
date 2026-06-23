import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HallDocument = HydratedDocument<Hall>;

@Schema({
  timestamps: true,
})
export class Hall {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    min: 1,
  })
  rowCount: number;

  @Prop({
    required: true,
    min: 1,
  })
  seatsPerRow: number;
}

export const HallSchema = SchemaFactory.createForClass(Hall);
