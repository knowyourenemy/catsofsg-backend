import express, { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  CatError,
  MissingEnvError,
  RouteError,
} from "../util/errorHandler";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

if (!process.env.RECAPTCHA_SECRET_KEY) {
  throw new MissingEnvError();
}

export const reCaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.captcha) {
      throw new BadRequestError("Missing ReCaptcha token");
    }

    axios
      .post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.captcha}`
      )
      .then((res) => {
        if (res.status == 200) {
          next();
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch((e: any) => {
        throw e;
      });
  } catch (e: any) {
    if (e instanceof CatError) {
      next(e);
    } else {
      next(new RouteError(e.message));
    }
  }
};
