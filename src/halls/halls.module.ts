import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { HallsController } from './halls.controller';
import { HallsService } from './halls.service';
import { HallRepository } from './repositories/hall.repository';
import { Hall, HallSchema } from './schemas/hall.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Hall.name,
        schema: HallSchema,
      },
    ]),
  ],
  controllers: [HallsController],
  providers: [HallsService, HallRepository],
  exports: [HallsService],
})
export class HallsModule {}
