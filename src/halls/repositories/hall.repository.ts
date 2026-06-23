import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../commons/repositories/base.repository';
import { Hall, HallDocument } from '../schemas/hall.schema';

@Injectable()
export class HallRepository extends BaseRepository<HallDocument> {
  constructor(
    @InjectModel(Hall.name)
    private readonly hallModel: Model<HallDocument>,
  ) {
    super(hallModel);
  }
}
