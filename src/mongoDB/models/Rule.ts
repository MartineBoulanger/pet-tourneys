import mongoose from 'mongoose';

const RuleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageIds: [String],
    order: Number,
  },
  {
    timestamps: true,
  }
);

export const Rule = mongoose.models.Rule || mongoose.model('Rule', RuleSchema);
