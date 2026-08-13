import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const teamSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    members: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const activitySchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    userId: { type: Number, required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    calories: { type: Number, required: true }
  },
  { timestamps: true }
);

const leaderboardSchema = new Schema(
  {
    rank: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    points: { type: Number, required: true }
  },
  { timestamps: true }
);

const workoutSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    difficulty: { type: String, required: true },
    minutes: { type: Number, required: true }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export const LeaderboardEntry = mongoose.models.LeaderboardEntry || mongoose.model('LeaderboardEntry', leaderboardSchema, 'leaderboards');
export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);

export default {
  User,
  Team,
  Activity,
  LeaderboardEntry,
  Workout
};
