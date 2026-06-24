import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseRepository } from '../../commons/repositories/base.repository';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { Reservation, ReservationDocument } from '../schemas/reservation.schema';

@Injectable()
export class ReservationRepository extends BaseRepository<ReservationDocument> {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
  ) {
    super(reservationModel);
  }

  async findActiveBySession(
    sessionId: string,
  ): Promise<ReservationDocument[]> {
    return this.reservationModel
      .find({
        sessionId: new Types.ObjectId(sessionId),
        status: {
          $in: [ReservationStatus.PENDING, ReservationStatus.PAID],
        },
      })
      .exec();
  }

  async findActiveBySessionAndSeat(
    sessionId: string,
    seatCode: string,
  ): Promise<ReservationDocument | null> {
    return this.reservationModel
      .findOne({
        sessionId: new Types.ObjectId(sessionId),
        seatCode,
        status: {
          $in: [ReservationStatus.PENDING, ReservationStatus.PAID],
        },
      })
      .exec();
  }

  async findByUserIdPopulated(
    userId: string,
  ): Promise<ReservationDocument[]> {
    return this.reservationModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('sessionId')
      .exec();
  }

  async findExpiredPendingSessionIds(): Promise<string[]> {
    const now = new Date();
    const reservations = await this.reservationModel
      .find({
        status: ReservationStatus.PENDING,
        expiresAt: { $lt: now },
      })
      .select('sessionId')
      .exec();

    return [
      ...new Set(reservations.map((reservation) => reservation.sessionId.toString())),
    ];
  }

  async cancelExpiredPendingReservations(): Promise<number> {
    const now = new Date();
    const result = await this.reservationModel
      .updateMany(
        {
          status: ReservationStatus.PENDING,
          expiresAt: { $lt: now },
        },
        {
          $set: {
            status: ReservationStatus.CANCELLED,
            cancelledAt: now,
          },
        },
      )
      .exec();

    return result.modifiedCount;
  }
}
