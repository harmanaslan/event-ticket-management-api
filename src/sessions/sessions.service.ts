import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { HallsService } from '../halls/halls.service';
import { MoviesService } from '../movies/movies.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionRepository } from './repositories/session.repository';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly moviesService: MoviesService,
    private readonly hallsService: HallsService,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    await this.moviesService.findOne(createSessionDto.movieId);
    await this.hallsService.findOne(createSessionDto.hallId);

    const startTime = new Date(createSessionDto.startTime);
    const endTime = new Date(createSessionDto.endTime);
    const now = new Date();

    if (startTime <= now) {
      throw new BadRequestException('startTime must be in the future');
    }

    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }

    return this.sessionRepository.create({
      movieId: new Types.ObjectId(createSessionDto.movieId),
      hallId: new Types.ObjectId(createSessionDto.hallId),
      startTime,
      endTime,
    });
  }

  async findAll() {
    return this.sessionRepository.findAllPopulated();
  }

  async findOne(id: string) {
    const session = await this.sessionRepository.findByIdPopulated(id);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }
}
