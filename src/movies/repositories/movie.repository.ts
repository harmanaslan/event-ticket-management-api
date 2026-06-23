import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../commons/repositories/base.repository';
import { Movie, MovieDocument } from '../schemas/movie.schema';

@Injectable()
export class MovieRepository extends BaseRepository<MovieDocument> {
  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<MovieDocument>,
  ) {
    super(movieModel);
  }
}
