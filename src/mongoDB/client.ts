import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI)
  throw new Error('Invalid/Missing environment variable: MONGODB_URI');

const MONGODB_URI = process.env.MONGODB_URI!;
let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(MONGODB_URI);
  }

  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(MONGODB_URI);
}

export default client;
