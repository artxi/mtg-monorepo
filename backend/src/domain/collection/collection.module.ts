import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionCard, CollectionCardSchema } from './collection-card.schema';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CollectionCard.name, schema: CollectionCardSchema }]),
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
