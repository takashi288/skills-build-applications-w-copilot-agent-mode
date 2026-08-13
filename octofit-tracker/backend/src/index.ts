import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

const fallbackUsers = [
  { id: 1, name: 'Ava', email: 'ava@example.com', points: 1200 },
  { id: 2, name: 'Leo', email: 'leo@example.com', points: 980 },
  { id: 3, name: 'Mia', email: 'mia@example.com', points: 1105 }
];

const fallbackTeams = [
  { id: 1, name: 'Trail Blazers', members: 6, points: 3270 },
  { id: 2, name: 'Peak Performers', members: 5, points: 3015 },
  { id: 3, name: 'Sunrise Striders', members: 7, points: 2890 }
];

const fallbackActivities = [
  { id: 1, userId: 1, type: 'Running', duration: 30, calories: 260 },
  { id: 2, userId: 2, type: 'Strength', duration: 45, calories: 310 },
  { id: 3, userId: 3, type: 'Walking', duration: 25, calories: 180 }
];

const fallbackLeaderboard = [
  { rank: 1, name: 'Ava', points: 1200 },
  { rank: 2, name: 'Mia', points: 1105 },
  { rank: 3, name: 'Leo', points: 980 }
];

const fallbackWorkouts = [
  { id: 1, name: 'Cardio Circuit', difficulty: 'Medium', minutes: 25 },
  { id: 2, name: 'Core Burn', difficulty: 'High', minutes: 20 },
  { id: 3, name: 'Mobility Flow', difficulty: 'Low', minutes: 15 }
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.apiBaseUrl = baseUrl;

const safeQuery = async (operation: () => Promise<any>, fallback: any[]) => {
  try {
    const result = await operation();
    return Array.isArray(result) && result.length > 0 ? result : fallback;
  } catch {
    return fallback;
  }
};

// Routes
app.get('/api', (req, res) => {
  res.json({
    message: 'OctoFit Tracker API',
    baseUrl,
    routes: [
      '/api/health',
      '/api/users/',
      '/api/teams/',
      '/api/activities/',
      '/api/leaderboard/',
      '/api/workouts/'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', baseUrl });
});

app.get('/api/users/', async (req, res) => {
  res.json(await safeQuery(async () => User.find({}).lean().exec(), fallbackUsers));
});

app.get('/api/teams/', async (req, res) => {
  res.json(await safeQuery(async () => Team.find({}).lean().exec(), fallbackTeams));
});

app.get('/api/activities/', async (req, res) => {
  res.json(await safeQuery(async () => Activity.find({}).lean().exec(), fallbackActivities));
});

app.get('/api/leaderboard/', async (req, res) => {
  res.json(await safeQuery(async () => LeaderboardEntry.find({}).sort({ rank: 1 }).lean().exec(), fallbackLeaderboard));
});

app.get('/api/workouts/', async (req, res) => {
  res.json(await safeQuery(async () => Workout.find({}).lean().exec(), fallbackWorkouts));
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.params.id) }).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch {
    const user = fallbackUsers.find((entry) => entry.id === Number(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  }
});

app.get('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findOne({ id: Number(req.params.id) }).lean();
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    return res.json(team);
  } catch {
    const team = fallbackTeams.find((entry) => entry.id === Number(req.params.id));
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    return res.json(team);
  }
});

app.get('/api/activities/:id', async (req, res) => {
  try {
    const activity = await Activity.findOne({ id: Number(req.params.id) }).lean();
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    return res.json(activity);
  } catch {
    const activity = fallbackActivities.find((entry) => entry.id === Number(req.params.id));
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    return res.json(activity);
  }
});

app.get('/api/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findOne({ id: Number(req.params.id) }).lean();
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    return res.json(workout);
  } catch {
    const workout = fallbackWorkouts.find((entry) => entry.id === Number(req.params.id));
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    return res.json(workout);
  }
});

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.warn('MongoDB is unavailable; continuing with in-memory API data for local development.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API base URL: ${baseUrl}`);
  });
};

startServer();

export default app;
