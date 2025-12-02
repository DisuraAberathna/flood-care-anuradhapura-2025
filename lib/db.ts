import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || process.env.DB_NAME || 'flood_data';

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(MONGODB_DB);
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function initDatabase() {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('isolated_people');

    // Create indexes for better query performance
    await collection.createIndex({ name: 1 });
    await collection.createIndex({ location: 1 });
    await collection.createIndex({ created_at: -1 });
    await collection.createIndex({ nic: 1 });

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export async function getCollection(name: string = 'isolated_people'): Promise<Collection> {
  const database = await connectToDatabase();
  return database.collection(name);
}

// Close connection (useful for cleanup)
export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

export default { connectToDatabase, getCollection, initDatabase, closeConnection };
