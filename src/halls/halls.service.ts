import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { HallRepository } from './repositories/hall.repository';

@Injectable()
export class HallsService {
  constructor(private readonly hallRepository: HallRepository) {}

  async create(createHallDto: CreateHallDto) {
    return this.hallRepository.create(createHallDto);
  }

  async findAll() {
    return this.hallRepository.find();
  }

  async findOne(id: string) {
    const hall = await this.hallRepository.findById(id);

    if (!hall) {
      throw new NotFoundException('Hall not found');
    }

    return hall;
  }
}
