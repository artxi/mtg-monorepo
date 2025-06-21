import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ImportJob extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, enum: ['pending', 'processing', 'completed', 'failed'] })
  status: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  errorMessage?: string;

  // Optionally: fileName?: string; importedCount?: number;
}

export const ImportJobSchema = SchemaFactory.createForClass(ImportJob);
