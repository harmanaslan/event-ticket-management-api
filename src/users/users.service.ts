import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { Role } from './enums/role.enum';

type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserData) {
    const user = await this.userRepository.create({
      ...data,
      email: data.email.trim().toLowerCase(),
    });

    return this.sanitizeUser(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: UserDocument) {
    const userObject = user.toObject();
    const { password: _password, ...sanitizedUser } = userObject;
    return sanitizedUser;
  }
}
