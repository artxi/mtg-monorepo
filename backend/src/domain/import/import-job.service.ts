import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImportJob } from './import-job.schema';

@Injectable()
export class ImportJobService {
  constructor(
    @InjectModel(ImportJob.name) private importJobModel: Model<ImportJob>,
  ) {}

  async findAllByUser(userId: string) {
    return this.importJobModel.find({ userId }).exec();
  }

  async create(userId: string, data: Partial<ImportJob>) {
    return this.importJobModel.create({ ...data, userId });
  }

  async findById(userId: string, id: string) {
    const job = await this.importJobModel.findOne({ _id: id, userId });
    if (!job) throw new NotFoundException('Import job not found');
    return job;
  }
}
