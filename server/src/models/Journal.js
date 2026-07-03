import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    nasaImageUrl: { type: String },
    nasaImageTitle: { type: String },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

journalSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Journal', journalSchema);
