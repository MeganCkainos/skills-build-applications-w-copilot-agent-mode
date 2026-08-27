import { Schema, model } from 'mongoose'

export interface WorkoutDocument {
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  activityType: string
  durationMinutes: number
}

const workoutSchema = new Schema<WorkoutDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    level: { type: String, required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    activityType: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
)

export default model<WorkoutDocument>('Workout', workoutSchema)
