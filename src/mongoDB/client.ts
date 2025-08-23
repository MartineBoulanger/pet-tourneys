import mongoose from 'mongoose';

if (!global.mongoose) global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  const uri = process.env.MONGODB_URI!;
  if (!uri) throw new Error('Please add your Mongo URI to .env');
  if (global.mongoose.conn) return global.mongoose.conn;
  if (!global.mongoose.promise) {
    const opts = { bufferCommands: false };
    global.mongoose.promise = mongoose.connect(uri, opts);
  }
  try {
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    global.mongoose.promise = null;
    throw error;
  }
}

export default dbConnect;
