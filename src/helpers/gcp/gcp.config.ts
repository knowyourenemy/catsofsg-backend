import dotenv from "dotenv";
import { Bucket, Storage } from "@google-cloud/storage";
import path from "path";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const serviceKey = path.join(__dirname, "./keys.json");

let storage: Storage;

if (process.env.NODE_ENV == "development") {
  storage = new Storage({
    keyFilename: serviceKey,
    projectId: process.env.GCP_PROJECT_ID,
  });
} else {
  storage = new Storage();
}

const catsBucket: Bucket = storage.bucket(
  process.env.GCP_BUCKET_NAME || "bucket-name"
);

export default catsBucket;
