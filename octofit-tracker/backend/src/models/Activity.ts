import mongoose, { Schema, model } from 'mongoose';

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['running', 'walking', 'strength-training', 'other'], required: true },
  durationMinutes: { type: Number, min: 1, required: true },
  distanceKm: { type: Number, min: 0 },
  points: { type: Number, min: 0, default: 0 },
  notes: { type: String, trim: true, default: '' },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Activity || model('Activity', activitySchema);