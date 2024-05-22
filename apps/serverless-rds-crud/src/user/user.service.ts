import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly entityManager: EntityManager) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const data = await this.entityManager.findAll(User);
  }

  async findOne(id: string) {
    const data = await this.entityManager.findOne(User, { id });

    return data;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
