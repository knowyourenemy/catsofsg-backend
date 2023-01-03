import express, { Request, Response, NextFunction } from "express";
import multer, { Multer, MulterError } from "multer";
import { getCatWithImageUrl } from "../helpers/cats.get";
import { insertCatAndUploadImage } from "../helpers/cats.insert";
import { reCaptcha } from "../middleware/reCaptcha";
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
      return res.send(data);
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
    reCaptcha,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (
          !req.file ||
          !req.body.name.trim() ||
          !req.body.catId.trim() ||
          !req.body.sex.trim() ||
          !req.body.lng.trim() ||
          !req.body.lat.trim() ||
          !req.body.community.trim() ||
          !req.body.captcha.trim() ||
          !req.body.dateCreated.trim() ||
          !req.body.dateModified.trim()
        ) {
          console.log(req.body);
          throw new BadRequestError(
            "Incomplete information to process request."
          );
        }
        const url = await insertCatAndUploadImage(
          {
            name: req.body.name?.trim(),
            catId: req.body.catId?.trim(),
            sex: req.body.sex?.trim(),
            personality: req.body.personality?.trim(),
            likes: req.body.likes?.trim(),
            dislikes: req.body.dislikes?.trim(),
            other: req.body.other?.trim(),
            dateCreated: parseInt(req.body.dateCreated?.trim()),
            dateModified: parseInt(req.body.dateModified?.trim()),
            position: {
              lat: parseFloat(req.body.lat?.trim()),
              lng: parseFloat(req.body.lng?.trim()),
            },
            community: req.body.community?.trim(),
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
      return res.send(data);
    } catch (e: any) {
      if (e instanceof CatError) {
        next(e);
      } else {
        next(new RouteError(e.message));
      }
    }
  });

export default router;
