import express from "express";
import dotenv from "dotenv";
import catsRouter from "./routes/cats";
import { connectToDatabase } from "./connect";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

const app = express();

connectToDatabase();

app.use(express.json());

app.get("/api", (req: express.Request, res: express.Response) => {
  console.log("yeah it ran");
  res.send("<h2>Hi There</h2>");
});

app.use("/api/cats", catsRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
