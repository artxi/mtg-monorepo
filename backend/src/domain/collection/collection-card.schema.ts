import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CollectionCardDocument = HydratedDocument<CollectionCard>;

@Schema({ timestamps: true })
export class CollectionCard {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  scryfallId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: 'NM' })
  condition: string;

  @Prop({ default: 'en' })
  language: string;

  @Prop({ required: true })
  finish: string;
}

export const CollectionCardSchema = SchemaFactory.createForClass(CollectionCard);
