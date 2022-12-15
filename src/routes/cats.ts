import express from "express";
import { insertCatAndUploadImage } from "../helpers/cats.insert";
import { getAllCats, getCatsCollection, insertCat } from "../models/cats.db";

const router = express.Router();

router
  .route("/")
  .get(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.log("GET CATS ROUTE!");
      const catsCollection = getCatsCollection();
      const data = await getAllCats(catsCollection);
      res.send(data);
    }
  )
  .post(async (req: any, res: express.Response, next: express.NextFunction) => {
    console.log(req.body);
    console.log(req.file);
    const url = await insertCatAndUploadImage(
      {
        name: req.body.name,
        catId: req.body.catId,
        colour: req.body.colour,
      },
      req.file
    );

    return res.send({
      imageUrl: url,
    });
  });

export default router;
