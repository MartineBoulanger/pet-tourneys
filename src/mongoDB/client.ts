import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  const uri = process.env.NEXT_PUBLIC_MONGODB_URI!;
  if (!uri) throw new Error('Please add your Mongo URI to .env');
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}

export default dbConnect;
