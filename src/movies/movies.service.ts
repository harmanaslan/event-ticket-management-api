import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieRepository } from './repositories/movie.repository';

@Injectable()
export class MoviesService {
  constructor(private readonly movieRepository: MovieRepository) {}

  async create(createMovieDto: CreateMovieDto) {
    return this.movieRepository.create(createMovieDto);
  }

  async findAll() {
    return this.movieRepository.find();
  }

  async findOne(id: string) {
    const movie = await this.movieRepository.findById(id);

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }
}
