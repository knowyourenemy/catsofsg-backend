import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import { CatInterface } from "./models/cats.db";
import { CatError, DbError, MissingEnvError } from "./util/errorHandler";

let dbConnection: Db;
let catsCollection: Collection<CatInterface>;

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

export const connectToDatabase = async () => {
  try {
    if (
      !process.env.DB_CONN_STRING ||
      !process.env.DB_NAME ||
      !process.env.CATS_COLLECTION_NAME
    ) {
      throw new MissingEnvError();
    }

    const client: MongoClient = new MongoClient(process.env.DB_CONN_STRING);

    await client.connect();

    const db: Db = client.db(process.env.DB_NAME);

    console.log(`Successfully connected to database: ${db.databaseName}.`);

    dbConnection = db;
    catsCollection = db.collection(process.env.CATS_COLLECTION_NAME);
  } catch (e: any) {
    if (e instanceof CatError) {
      throw e;
    } else {
      throw new CatError("Could not connect to DB.", 500);
    }
  }
};

export const getCatsCollection = (): Collection<CatInterface> => catsCollection;
