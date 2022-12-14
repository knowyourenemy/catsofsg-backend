import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

let dbConnection: Db;

export const connectToDatabase = async () => {
  // dotenv.config();

  // console.log(process.env.DB_CONN_STRING || "connection_string");
  const client: MongoClient = new MongoClient(
    process.env.DB_CONN_STRING || "connection_string"
  );

  await client.connect();

  const db: Db = client.db(process.env.DB_NAME);

  console.log(`Successfully connected to database: ${db.databaseName}`);

  dbConnection = db;
};

export const getDbConnection = async () => {
  if (!dbConnection) {
    await connectToDatabase();
  }
  return dbConnection;
};
