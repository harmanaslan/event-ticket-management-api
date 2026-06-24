import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { HallsModule } from '../halls/halls.module';
import { MoviesModule } from '../movies/movies.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { SessionRepository } from './repositories/session.repository';
import { Session, SessionSchema } from './schemas/session.schema';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [
    AuthModule,
    MoviesModule,
    HallsModule,
    forwardRef(() => ReservationsModule),
    MongooseModule.forFeature([
      {
        name: Session.name,
        schema: SessionSchema,
      },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionRepository],
  exports: [SessionsService],
})
export class SessionsModule {}
