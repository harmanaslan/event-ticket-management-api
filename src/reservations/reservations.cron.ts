import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationsService } from './reservations.service';

@Injectable()
export class ReservationsCron {
  private readonly logger = new Logger(ReservationsCron.name);

  constructor(private readonly reservationsService: ReservationsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cancelExpiredReservations() {
    const cancelledCount =
      await this.reservationsService.cancelExpiredPendingReservations();

    if (cancelledCount > 0) {
      this.logger.log(`Cancelled ${cancelledCount} expired reservation(s)`);
    }
  }
}
