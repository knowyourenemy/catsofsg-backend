import dotenv from "dotenv";
import { Bucket, Storage } from "@google-cloud/storage";
import path from "path";
import {
  CatError,
  HelperError,
  MissingEnvError,
} from "../../util/errorHandler";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

if (!process.env.GCP_PROJECT_ID || !process.env.GCP_BUCKET_NAME) {
  throw new MissingEnvError();
}

let storage: Storage;
let catsBucket: Bucket;

try {
  if (process.env.NODE_ENV == "development") {
    const serviceKey = path.join(__dirname, "./keys.json");
    storage = new Storage({
      keyFilename: serviceKey,
      projectId: process.env.GCP_PROJECT_ID,
    });
  } else {
    storage = new Storage();
  }

  catsBucket = storage.bucket(process.env.GCP_BUCKET_NAME);
  if (!catsBucket) {
    throw new HelperError("Could not connect to bucket.");
  }
} catch (e: any) {
  if (e instanceof CatError) {
    throw e;
  } else {
    throw new HelperError(e.message);
  }
}

export default catsBucket;
