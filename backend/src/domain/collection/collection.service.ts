import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionCard, CollectionCardDocument } from './collection-card.schema';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(CollectionCard.name) private collectionCardModel: Model<CollectionCardDocument>,
  ) {}

  async findAllByUser(userId: string) {
    return this.collectionCardModel.find({ userId }).exec();
  }

  async create(userId: string, data: Partial<CollectionCard>) {
    return this.collectionCardModel.create({ ...data, userId });
  }

  async update(userId: string, id: string, data: Partial<CollectionCard>) {
    const card = await this.collectionCardModel.findOneAndUpdate(
      { _id: id, userId },
      data,
      { new: true },
    );
    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async delete(userId: string, id: string) {
    const result = await this.collectionCardModel.deleteOne({ _id: id, userId });
    if (result.deletedCount === 0) throw new NotFoundException('Card not found');
    return { success: true };
  }
}
