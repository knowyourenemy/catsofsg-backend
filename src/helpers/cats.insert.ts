import { CatInterface, getCatsCollection, insertCat } from "../models/cats.db";
import catsBucket from "./gcp/gcp.config";

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file: any, fileName: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    const blob = catsBucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", async () => {
        console.log("this finished");
        const [signedUrl] = await blob.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });

        resolve(signedUrl);
      })
      .on("error", (e) => {
        console.log(e);
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

export const insertCatAndUploadImage = async (
  catData: Omit<CatInterface, "imageUrl" | "imageName">,
  imageFile: any
): Promise<string> => {
  const newname = `${catData.catId}/${imageFile.originalname}`.replace(
    / /g,
    "_"
  );
  const url = await uploadImage(imageFile, newname);
  const catCollection = getCatsCollection();
  const res = await insertCat(catCollection, {
    ...catData,
    imageUrl: url,
    imageName: newname,
  });
  return url;
};
