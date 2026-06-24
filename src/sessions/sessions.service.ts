import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  getSessionSeatsCacheKey,
  SESSION_SEATS_CACHE_TTL_SECONDS,
} from '../cache/cache.constants';
import { CacheService } from '../cache/cache.service';
import { generateSeatList } from '../commons/utils/seat.util';
import { HallsService } from '../halls/halls.service';
import { HallDocument } from '../halls/schemas/hall.schema';
import { MoviesService } from '../movies/movies.service';
import { ReservationRepository } from '../reservations/repositories/reservation.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionRepository } from './repositories/session.repository';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly moviesService: MoviesService,
    private readonly hallsService: HallsService,
    private readonly reservationRepository: ReservationRepository,
    private readonly cacheService: CacheService,
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

  async getSeatAvailability(sessionId: string) {
    const cacheKey = getSessionSeatsCacheKey(sessionId);
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const seatAvailability = await this.buildSeatAvailability(sessionId);

    await this.cacheService.set(
      cacheKey,
      seatAvailability,
      SESSION_SEATS_CACHE_TTL_SECONDS,
    );

    return seatAvailability;
  }

  private async buildSeatAvailability(sessionId: string) {
    const session = await this.sessionRepository.findByIdPopulated(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const hall = session.hallId as unknown as HallDocument;
    const activeReservations =
      await this.reservationRepository.findActiveBySession(sessionId);

    const reservationMap = new Map(
      activeReservations.map((reservation) => [
        reservation.seatCode,
        reservation.status,
      ]),
    );

    const seats = generateSeatList(hall.rowCount, hall.seatsPerRow).map(
      (seat) => ({
        ...seat,
        status: reservationMap.get(seat.seatCode) ?? 'AVAILABLE',
      }),
    );

    return {
      sessionId: session._id.toString(),
      hall: {
        id: hall._id.toString(),
        name: hall.name,
        rowCount: hall.rowCount,
        seatsPerRow: hall.seatsPerRow,
      },
      seats,
    };
  }
}
