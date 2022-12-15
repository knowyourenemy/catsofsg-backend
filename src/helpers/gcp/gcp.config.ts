import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";
import path from "path";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const serviceKey = path.join(__dirname, "./keys.json");

let storage;

if (process.env.NODE_ENV == "development") {
  storage = new Storage({
    keyFilename: serviceKey,
    projectId: process.env.GCP_PROJECT_ID,
  });
} else {
  storage = new Storage();
}

const catsBucket = storage.bucket(process.env.GCP_BUCKET_NAME || "bucket-name");

export default catsBucket;
