const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  try {
    if (!mongoUri) throw new Error('MONGODB_URI is not provided');
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || undefined,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
