import express from "express";
import { getCatWithImageUrl } from "../helpers/cats.get";
import { insertCatAndUploadImage } from "../helpers/cats.insert";
import { getAllCats } from "../models/cats.db";

const router = express.Router();

router
  .route("/")
  .get(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const data = await getAllCats();
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

router
  .route("/:catId")
  .get(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const data = await getCatWithImageUrl(req.params.catId);
      res.send(data);
    }
  );

export default router;
