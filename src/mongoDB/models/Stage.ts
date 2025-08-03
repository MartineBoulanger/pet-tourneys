import { Schema, model, models } from 'mongoose';
import { iStageDocument, Stage } from '../types';

const StageSchema = new Schema<iStageDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  order: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Stage || model<Stage>('Stage', StageSchema);
