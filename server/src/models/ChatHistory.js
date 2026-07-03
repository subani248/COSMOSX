import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'model'], required: true },
    content: { type: String, required: true },
    sessionId: { type: String, required: true },
  },
  { timestamps: true }
);

chatHistorySchema.index({ user: 1, sessionId: 1 });

export default mongoose.model('ChatHistory', chatHistorySchema);
