import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import { CatInterface } from "./models/cats.db";

let dbConnection: Db;
let catsCollection: Collection<CatInterface>;

export const connectToDatabase = async () => {
  const client: MongoClient = new MongoClient(
    process.env.DB_CONN_STRING || "connection_string"
  );

  await client.connect();

  const db: Db = client.db(process.env.DB_NAME);

  console.log(`Successfully connected to database: ${db.databaseName}`);

  dbConnection = db;
  catsCollection = db.collection(
    process.env.CATS_COLLECTION_NAME || "cat_collection"
  );
};

export const getCatsCollection = (): Collection<CatInterface> => catsCollection;
