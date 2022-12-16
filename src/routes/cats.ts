import express, { Request, Response, NextFunction } from "express";
import multer, { Multer, MulterError } from "multer";
import { getCatWithImageUrl } from "../helpers/cats.get";
import { insertCatAndUploadImage } from "../helpers/cats.insert";
import { getAllCats } from "../models/cats.db";
import { BadRequestError, CatError, RouteError } from "../util/errorHandler";

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
    try {
      const data = await getAllCats();
      res.send(data);
    } catch (e: any) {
      if (e instanceof CatError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  })
  .post(
    "/",
    multerMid.single("file"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (
          !req.file ||
          !req.body.name ||
          !req.body.catId ||
          !req.body.colour
        ) {
          throw new BadRequestError(
            "Incomplete information to process request."
          );
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
      } catch (e: any) {
        if (e instanceof CatError) {
          next(e);
        } else {
          next(new RouteError(e.message));
        }
      }
    }
  );

router
  .route("/:catId")
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getCatWithImageUrl(req.params.catId);
      res.send(data);
    } catch (e: any) {
      if (e instanceof CatError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  });

export default router;
