import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({
  timestamps: true,
})
export class Movie {
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
    min: 1,
  })
  durationMinutes: number;

  @Prop({
    trim: true,
  })
  genre?: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
