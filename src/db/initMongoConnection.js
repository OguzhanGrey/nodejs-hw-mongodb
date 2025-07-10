import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoDB = async () => {
  const user = env('MONGODB_USER');
  const password = env('MONGODB_PASSWORD');
  const url = env('MONGODB_URL');
  const dbName = env('MONGODB_DB');

  const connectionString = `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority&appName=Oguzhan`;
  try {
    await mongoose.connect(connectionString);
    console.log('MongoDB connection established successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
