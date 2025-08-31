import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'pml_admin';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global is used here to maintain a cached connection across hot reloads
// in development. In production, this will be a new connection per Lambda
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function createConnection() {
  const options = {
    maxPoolSize: 5, // Smaller pool for serverless
    minPoolSize: 1, // Minimum connections
    maxIdleTimeMS: 60000, // Keep connections longer in serverless
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  const client = new MongoClient(MONGODB_URI, options);
  await client.connect();

  const db = client.db(MONGODB_DB);
  await db.command({ ping: 1 });

  return { client, db };
}

export async function connectToDatabase() {
  // In serverless environments, we might want to create a new connection
  // for each request to avoid cold start issues with connection pooling
  if (process.env.VERCEL_ENV === 'production' || !cachedClient) {
    try {
      const { client, db } = await createConnection();
      cachedClient = client;
      cachedDb = db;
    } catch (error) {
      console.error('Failed to create MongoDB connection:', error);
      throw error;
    }
  }

  return { client: cachedClient!, db: cachedDb! };
}

export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
