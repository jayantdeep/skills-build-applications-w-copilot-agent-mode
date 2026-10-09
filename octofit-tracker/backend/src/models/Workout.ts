import mongoose, { Schema, model } from 'mongoose';

const workoutSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  activityType: { type: String, enum: ['running', 'walking', 'strength-training', 'other'], required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  durationMinutes: { type: Number, min: 1, required: true },
  instructions: [{ type: String, trim: true }],
}, { timestamps: true });

export default mongoose.models.Workout || model('Workout', workoutSchema);