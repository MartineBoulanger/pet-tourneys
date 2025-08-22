import mongoose from 'mongoose';

const PrizeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    isCarousel: { type: Boolean, default: false },
    isColumnLayout: { type: Boolean, default: false },
    imagePosition: { type: String, required: false, default: 'bottom' },
    textAlignment: { type: String, required: false, default: 'left' },
    imageIds: [String],
    videoUrl: String,
    order: Number,
  },
  {
    timestamps: true,
  }
);

export const Prize =
  mongoose.models.Prize || mongoose.model('Prize', PrizeSchema);
