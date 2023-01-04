import express, { NextFunction, Request, Response } from "express";
var cors = require("cors");
import dotenv from "dotenv";
import catsRouter from "./routes/cats";
import { connectToDatabase } from "./db";
import { CatError } from "./util/errorHandler";
import { MulterError } from "multer";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const serveApp = async () => {
  const app = express();

  await connectToDatabase();

  app.use(express.json());

  if (process.env.NODE_ENV == "production") {
    app.use(
      cors({
        origin: ["https://www.catsofsg.com", "https://catsofsg.com"],
      })
    );
  } else {
    app.use(cors());
  }

  app.get("/api", (req: express.Request, res: express.Response) => {
    res.send("<h2>Cats of SG</h2>");
  });

  app.use("/api/cats", catsRouter);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof MulterError) {
      return res.status(400).send(err.message);
    } else if (err instanceof CatError) {
      return res.status(err.statusCode).send(err.message);
    } else {
      return res.sendStatus(500);
    }
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => console.log(`listening on port ${port}.`));
};

serveApp();
