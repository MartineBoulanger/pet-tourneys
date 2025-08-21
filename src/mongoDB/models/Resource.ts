import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageIds: [String],
    order: Number,
  },
  {
    timestamps: true,
  }
);

export const Resource =
  mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
