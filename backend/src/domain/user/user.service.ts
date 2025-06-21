import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
