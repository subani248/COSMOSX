import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nasaId: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String },
    hdurl: { type: String },
    mediaType: { type: String, default: 'image' },
    explanation: { type: String },
    date: { type: String },
    source: {
      type: String,
      enum: ['apod', 'mars', 'asteroid', 'earth', 'search'],
      default: 'apod',
    },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, nasaId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
