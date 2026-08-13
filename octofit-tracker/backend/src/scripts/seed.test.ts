import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';

test('seedDatabase populates octofit_db with realistic sample data', async () => {
  const connection = await seedDatabase();

  assert.equal(connection.name, 'octofit_db');

  const userCount = await mongoose.connection.collection('users').countDocuments();
  const teamCount = await mongoose.connection.collection('teams').countDocuments();
  const activityCount = await mongoose.connection.collection('activities').countDocuments();
  const leaderboardCount = await mongoose.connection.collection('leaderboards').countDocuments();
  const workoutCount = await mongoose.connection.collection('workouts').countDocuments();

  assert.ok(userCount > 0, 'users collection should have seeded records');
  assert.ok(teamCount > 0, 'teams collection should have seeded records');
  assert.ok(activityCount > 0, 'activities collection should have seeded records');
  assert.ok(leaderboardCount > 0, 'leaderboards collection should have seeded records');
  assert.ok(workoutCount > 0, 'workouts collection should have seeded records');

  await mongoose.disconnect();
});
