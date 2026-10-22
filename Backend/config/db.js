import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('[DB] MONGO_URI is not defined in environment variables');
      return;
    }

    await mongoose.connect(mongoUri);

    console.log('[DB] Connection Success');

    mongoose.connection.on('error', (err) => {
      console.error('[DB] Connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] Disconnected from MongoDB');
    });
  } catch (error) {
    console.error('[DB] Initial connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
