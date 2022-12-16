// import { File } from "@google-cloud/storage";
import { CatInterface, insertCat } from "../models/cats.db";
import { CatError, HelperError } from "../util/errorHandler";
import catsBucket from "./gcp/gcp.config";
import { getSignedUrl } from "./gcp/gcp.url";

/**
 * Upload file to GCP bucket.
 * @param {Express.Multer.File} file - file to be uploaded.
 * @returns {string} signed URL to access file.
 */
const uploadImage = (
  file: Express.Multer.File,
  fileName: string
): Promise<string> => {
  try {
    return new Promise<string>((resolve, reject) => {
      const { originalname, buffer } = file;

      const blob = catsBucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });
      blobStream
        .on("finish", async () => {
          const signedUrl = await getSignedUrl(blob);
          resolve(signedUrl);
        })
        .on("error", (e) => {
          reject(new HelperError("Could not upload image to bucket."));
        })
        .end(buffer);
    });
  } catch (e: any) {
    if (e instanceof CatError) {
      throw e;
    } else {
      throw new HelperError(e.message);
    }
  }
};

/**
 * Insert cat document into DB and upload file to GCP Bucket.
 * @param {Omit<CatInterface, "imageUrl" | "imageName">} catData - Cat document.
 * @param {Express.Multer.File} imageFile - Image to be uploaded.
 * @returns {string} URL to access image.
 */
export const insertCatAndUploadImage = async (
  catData: Omit<CatInterface, "imageUrl" | "imageName">,
  imageFile: Express.Multer.File
): Promise<string> => {
  try {
    const newname = `${catData.catId}/${imageFile.originalname}`.replace(
      / /g,
      "_"
    );
    const url = await uploadImage(imageFile, newname);
    const res = await insertCat({
      ...catData,
      imageUrl: url,
      imageName: newname,
    });
    return url;
  } catch (e: any) {
    if (e instanceof CatError) {
      throw e;
    } else {
      throw new HelperError(e.message);
    }
  }
};
