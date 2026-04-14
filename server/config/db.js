/**
 * ─────────────────────────────────────────────
 *  MongoDB Connection (Mongoose)
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vip-brand';

  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`  ✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`  ❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
