import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit-tracker';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding');

    // Seed data would go here
    console.log('Database seeding completed');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
