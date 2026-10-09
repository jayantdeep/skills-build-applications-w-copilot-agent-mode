import mongoose, { Schema, model } from 'mongoose';

const leaderboardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, enum: ['weekly', 'monthly', 'all-time'], default: 'weekly' },
  points: { type: Number, min: 0, default: 0 },
  rank: { type: Number, min: 1 },
}, { timestamps: true });

leaderboardSchema.index({ period: 1, points: -1 });

export default mongoose.models.Leaderboard || model('Leaderboard', leaderboardSchema);