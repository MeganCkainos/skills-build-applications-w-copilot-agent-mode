import { Schema, model } from 'mongoose'

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['running', 'walking', 'strength', 'cycling', 'other'] },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0, default: 0 },
    calories: { type: Number, min: 0, default: 0 },
    points: { type: Number, min: 0, default: 0 },
    performedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default model('Activity', activitySchema)
