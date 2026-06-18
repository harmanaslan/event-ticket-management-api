import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventRepository } from './repositories/event.repository';

@Injectable()
export class EventsService {
  constructor(private readonly eventRepository: EventRepository) {}

  async create(createEventDto: CreateEventDto) {
    const eventData = {
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
      availableTickets: createEventDto.totalTickets,
    };

    return this.eventRepository.create(eventData);
  }

  async findAll() {
    return this.eventRepository.find();
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }
}