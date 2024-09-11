// utils/dbConnect.js
import mongoose from 'mongoose';

async function dbConnect() {
  const dbUri = process.env.MONGODB_URI + process.env.MONGODB_DB; // Combine URI and DB name

  if (mongoose.connection.readyState >= 1) {
    return; // If already connected or connecting, use the existing connection
  }

  return mongoose.connect(dbUri) // No options needed here
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

export default dbConnect;