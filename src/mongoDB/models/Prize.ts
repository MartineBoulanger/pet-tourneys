import { Schema, model, models } from 'mongoose';
import { iPrizeDocument, Prize } from '../types';

const PrizeSchema = new Schema<iPrizeDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: Number, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Prize || model<Prize>('Prize', PrizeSchema);
