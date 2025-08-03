import { Schema, model, models } from 'mongoose';
import { iImageDocument, Image } from '../types';

const ImageSchema = new Schema<iImageDocument>({
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Image || model<Image>('Image', ImageSchema);
