import mongoose, { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  displayName: { type: String, required: true, trim: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
}, { timestamps: true });

export default mongoose.models.User || model('User', userSchema);