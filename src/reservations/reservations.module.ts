import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { SessionsModule } from '../sessions/sessions.module';
import { ReservationRepository } from './repositories/reservation.repository';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { ReservationsController } from './reservations.controller';
import { ReservationsCron } from './reservations.cron';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => SessionsModule),
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository, ReservationsCron],
  exports: [ReservationRepository],
})
export class ReservationsModule {}
