import { Db, MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB!;

if (!MONGODB_URI)
  throw new Error('Please define the MONGODB_URI environment variable');
if (!MONGODB_DB) throw new Error('Define the MONGODB_DB environment variable');

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // Check the cache
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // Set connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };

  // Connect to cluster
  const client = new MongoClient(MONGODB_URI, opts);
  await client.connect();
  const db = client.db(MONGODB_DB);

  // Set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}
