import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieRepository } from './repositories/movie.repository';
import { Movie, MovieSchema } from './schemas/movie.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Movie.name,
        schema: MovieSchema,
      },
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MovieRepository],
  exports: [MoviesService],
})
export class MoviesModule {}
