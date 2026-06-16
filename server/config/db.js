import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('your_mongodb_uri')) {
    console.warn('MONGO_URI not set or placeholder detected; skipping MongoDB connection.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'mehranmobile',
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;