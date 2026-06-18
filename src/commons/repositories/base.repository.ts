import { Model, QueryOptions, UpdateQuery } from 'mongoose';

type RepositoryFilter<T> = Record<string, unknown> | Partial<T>;

export abstract class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async find(filter: RepositoryFilter<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async findOne(filter: RepositoryFilter<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(
    filter: RepositoryFilter<T>,
    data: UpdateQuery<T>,
    options: QueryOptions = { new: true },
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, data, options).exec();
  }
}