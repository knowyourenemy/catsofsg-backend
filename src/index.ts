import express from "express";
import dotenv from "dotenv";
const multer = require("multer");
import catsRouter from "./routes/cats";
import { connectToDatabase } from "./db";
import { Multer } from "multer";

const serveApp = async () => {
  const app = express();

  await connectToDatabase();

  app.use(express.json());

  app.get("/api", (req: express.Request, res: express.Response) => {
    console.log("yeah it ran");
    res.send("<h2>Cats of SG</h2>");
  });

  app.use("/api/cats", catsRouter);

  const port = process.env.PORT || 3000;

  app.listen(port, () => console.log(`listening on port ${port}`));
};

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

serveApp();
