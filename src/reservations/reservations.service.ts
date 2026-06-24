import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Types } from 'mongoose';
import { getSessionSeatsCacheKey } from '../cache/cache.constants';
import { CacheService } from '../cache/cache.service';
import { Hall } from '../halls/schemas/hall.schema';
import { SessionsService } from '../sessions/sessions.service';
import {
  isValidSeatCode,
  normalizeSeatCode,
} from '../commons/utils/seat.util';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from './enums/reservation-status.enum';
import { ReservationRepository } from './repositories/reservation.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly sessionsService: SessionsService,
    private readonly cacheService: CacheService,
  ) {}

  async create(userId: string, createReservationDto: CreateReservationDto) {
    const session = await this.sessionsService.findOne(
      createReservationDto.sessionId,
    );
    const hall = session.hallId as unknown as Hall;
    const seatCode = normalizeSeatCode(createReservationDto.seatCode);

    if (!isValidSeatCode(seatCode, hall.rowCount, hall.seatsPerRow)) {
      throw new BadRequestException('Invalid seat code');
    }

    const existingReservation =
      await this.reservationRepository.findActiveBySessionAndSeat(
        createReservationDto.sessionId,
        seatCode,
      );

    if (existingReservation) {
      throw new ConflictException('Seat is already reserved');
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
      const reservation = await this.reservationRepository.create({
        sessionId: new Types.ObjectId(createReservationDto.sessionId),
        userId: new Types.ObjectId(userId),
        seatCode,
        status: ReservationStatus.PENDING,
        expiresAt,
      });

      await this.cacheService.del(
        getSessionSeatsCacheKey(createReservationDto.sessionId),
      );

      return reservation;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictException('Seat is already reserved');
      }

      throw error;
    }
  }

  async findMy(userId: string) {
    return this.reservationRepository.findByUserIdPopulated(userId);
  }

  async pay(userId: string, reservationId: string) {
    const reservation = await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.userId.toString() !== userId) {
      throw new ForbiddenException('You can only pay for your own reservation');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be paid');
    }

    if (new Date() > reservation.expiresAt) {
      throw new BadRequestException('Reservation has expired');
    }

    const updatedReservation = await this.reservationRepository.update(
      { _id: reservation._id },
      {
        status: ReservationStatus.PAID,
        paidAt: new Date(),
      },
    );

    await this.cacheService.del(
      getSessionSeatsCacheKey(reservation.sessionId.toString()),
    );

    return updatedReservation;
  }

  async cancelExpiredPendingReservations(): Promise<number> {
    const sessionIds =
      await this.reservationRepository.findExpiredPendingSessionIds();

    if (sessionIds.length === 0) {
      return 0;
    }

    const cancelledCount =
      await this.reservationRepository.cancelExpiredPendingReservations();

    if (cancelledCount > 0) {
      await Promise.all(
        sessionIds.map((sessionId) =>
          this.cacheService.del(getSessionSeatsCacheKey(sessionId)),
        ),
      );
    }

    return cancelledCount;
  }
}
