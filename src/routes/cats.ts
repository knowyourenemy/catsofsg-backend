import express from "express";
import { getAllCats, getCatsCollection } from "../models/cats.db";

const router = express.Router();

router.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log("GET CATS ROUTE!");
    const catsCollection = await getCatsCollection();
    const data = await getAllCats(catsCollection);
    res.send(data);
  }
);

export default router;
