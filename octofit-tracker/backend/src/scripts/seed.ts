import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

export async function seedDatabase({ closeConnection = false }: { closeConnection?: boolean } = {}) {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding');
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({})
    ]);

    const users = await User.insertMany([
      { id: 1, name: 'Ava Thompson', email: 'ava@example.com', points: 1200 },
      { id: 2, name: 'Leo Martinez', email: 'leo@example.com', points: 980 },
      { id: 3, name: 'Mia Johnson', email: 'mia@example.com', points: 1105 },
      { id: 4, name: 'Noah Kim', email: 'noah@example.com', points: 940 },
      { id: 5, name: 'Sofia Patel', email: 'sofia@example.com', points: 1325 }
    ]);

    await Team.insertMany([
      { id: 1, name: 'Trail Blazers', members: 6, points: 3270 },
      { id: 2, name: 'Peak Performers', members: 5, points: 3015 },
      { id: 3, name: 'Sunrise Striders', members: 7, points: 2890 }
    ]);

    await Activity.insertMany([
      { id: 1, userId: users[0].id, type: 'Running', duration: 30, calories: 260 },
      { id: 2, userId: users[1].id, type: 'Strength', duration: 45, calories: 310 },
      { id: 3, userId: users[2].id, type: 'Walking', duration: 25, calories: 180 },
      { id: 4, userId: users[3].id, type: 'Cycling', duration: 40, calories: 340 },
      { id: 5, userId: users[4].id, type: 'HIIT', duration: 28, calories: 290 }
    ]);

    await LeaderboardEntry.insertMany([
      { rank: 1, name: 'Ava Thompson', points: 1200 },
      { rank: 2, name: 'Mia Johnson', points: 1105 },
      { rank: 3, name: 'Leo Martinez', points: 980 },
      { rank: 4, name: 'Noah Kim', points: 940 },
      { rank: 5, name: 'Sofia Patel', points: 1325 }
    ]);

    await Workout.insertMany([
      { id: 1, name: 'Cardio Circuit', difficulty: 'Medium', minutes: 25 },
      { id: 2, name: 'Core Burn', difficulty: 'High', minutes: 20 },
      { id: 3, name: 'Mobility Flow', difficulty: 'Low', minutes: 15 },
      { id: 4, name: 'Sprint Intervals', difficulty: 'High', minutes: 22 },
      { id: 5, name: 'Recovery Walk', difficulty: 'Low', minutes: 30 }
    ]);

    console.log('Database seeding completed');

    if (closeConnection) {
      await mongoose.disconnect();
    }

    return mongoose.connection;
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase({ closeConnection: true }).catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
}
