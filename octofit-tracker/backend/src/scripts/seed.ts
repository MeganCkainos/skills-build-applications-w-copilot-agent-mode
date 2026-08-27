import mongoose from 'mongoose';
import { Activity, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.create([
      { username: 'alex.runner', email: 'alex.runner@example.com', displayName: 'Alex Runner' },
      { username: 'jamie.strength', email: 'jamie.strength@example.com', displayName: 'Jamie Strength' },
      { username: 'taylor.cyclist', email: 'taylor.cyclist@example.com', displayName: 'Taylor Cyclist' },
      { username: 'morgan.walker', email: 'morgan.walker@example.com', displayName: 'Morgan Walker' },
    ]);

    const teams = await Team.create([
      {
        name: 'Trail Blazers',
        description: 'Weekend runners and outdoor explorers.',
        memberIds: [users[0]._id, users[3]._id],
      },
      {
        name: 'Power Squad',
        description: 'Strength and cycling enthusiasts.',
        memberIds: [users[1]._id, users[2]._id],
      },
    ]);

    await User.bulkWrite([
      { updateOne: { filter: { _id: users[0]._id }, update: { teamId: teams[0]._id } } },
      { updateOne: { filter: { _id: users[3]._id }, update: { teamId: teams[0]._id } } },
      { updateOne: { filter: { _id: users[1]._id }, update: { teamId: teams[1]._id } } },
      { updateOne: { filter: { _id: users[2]._id }, update: { teamId: teams[1]._id } } },
    ]);

    await Activity.create([
      { userId: users[0]._id, type: 'running', durationMinutes: 32, distanceKm: 5.2, calories: 410, points: 58, performedAt: new Date('2026-08-24T07:30:00Z') },
      { userId: users[1]._id, type: 'strength', durationMinutes: 45, calories: 330, points: 45, performedAt: new Date('2026-08-23T16:00:00Z') },
      { userId: users[2]._id, type: 'cycling', durationMinutes: 50, distanceKm: 18, calories: 520, points: 140, performedAt: new Date('2026-08-25T09:00:00Z') },
      { userId: users[3]._id, type: 'walking', durationMinutes: 38, distanceKm: 3.1, calories: 190, points: 54, performedAt: new Date('2026-08-26T12:15:00Z') },
    ]);

    await Workout.create([
      { title: 'Easy Trail Run', description: 'A relaxed run focused on steady pacing.', level: 'beginner', activityType: 'running', durationMinutes: 25 },
      { title: 'Full Body Circuit', description: 'A balanced circuit of bodyweight strength exercises.', level: 'intermediate', activityType: 'strength', durationMinutes: 35 },
      { title: 'Hill Climb Challenge', description: 'A demanding ride with sustained uphill intervals.', level: 'advanced', activityType: 'cycling', durationMinutes: 50 },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
