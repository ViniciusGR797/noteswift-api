import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let client: MongoClient;
let db: Db;

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI not defined in the environment variables.");
    }

    client = await MongoClient.connect(uri);
    db = client.db();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export function getDB(): Db {
  return db;
}

export async function closeDBConnection() {
  try {
    if (client) {
      await client.close();
      console.log("Closed MongoDB connection.");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}
