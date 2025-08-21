import mongoose from 'mongoose';

const UploadSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    usedIn: [{ type: mongoose.Schema.Types.ObjectId, refPath: 'usedInModel' }],
    usedInModel: String,
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export const Upload =
  mongoose.models.Upload || mongoose.model('Upload', UploadSchema);
