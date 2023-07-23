import { MongoClient, Db } from 'mongodb';
import config from '../config';

let client: MongoClient;
let db: Db;

export async function connectDB() {
  try {
    const uri = config.mongodbUri;

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
