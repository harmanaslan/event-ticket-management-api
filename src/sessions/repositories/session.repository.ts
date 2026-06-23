import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../commons/repositories/base.repository';
import { Session, SessionDocument } from '../schemas/session.schema';

@Injectable()
export class SessionRepository extends BaseRepository<SessionDocument> {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {
    super(sessionModel);
  }

  async findAllPopulated(): Promise<SessionDocument[]> {
    return this.sessionModel
      .find()
      .populate('movieId')
      .populate('hallId')
      .exec();
  }

  async findByIdPopulated(id: string): Promise<SessionDocument | null> {
    return this.sessionModel
      .findById(id)
      .populate('movieId')
      .populate('hallId')
      .exec();
  }
}
