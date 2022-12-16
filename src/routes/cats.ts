import express, { Request, Response, NextFunction } from "express";
import multer, { Multer } from "multer";
import { getCatWithImageUrl } from "../helpers/cats.get";
import { insertCatAndUploadImage } from "../helpers/cats.insert";
import { getAllCats } from "../models/cats.db";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const multerMid: Multer = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

const router = express.Router();

router
  .get("/", async (req: Request, res: Response, next: NextFunction) => {
    const data = await getAllCats();
    res.send(data);
  })
  .post(
    "/",
    multerMid.single("file"),
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.file) {
        throw new Error("missing file");
      }
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
    }
  );

router
  .route("/:catId")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    const data = await getCatWithImageUrl(req.params.catId);
    res.send(data);
  });

export default router;
