import { Db, Collection } from "mongodb";
import { getCatsCollection } from "../db";

export interface CatInterface {
  name: string;
  colour: string;
  imageUrl: string;
  imageName: string;
  catId: string;
}

/**
 * Get all cat documents.
 * @returns {CatInterface[]} Array of cat documents.
 */
export const getAllCats = async (): Promise<CatInterface[]> => {
  const catsCollection = getCatsCollection();
  const res = await catsCollection.find().toArray();
  return res;
};

/**
 * Get single cat document.
 * @param catId - ID of cat
 * @returns {CatInterface} Cat document.
 */
export const getSingleCat = async (catId: string): Promise<CatInterface> => {
  const catsCollection = getCatsCollection();
  const res = await catsCollection.findOne({ catId });
  if (!res) {
    throw new Error("could not find cat");
  }
  return res;
};

/**
 * Insert cat into DB and GCP bucket.
 * @param catId - ID of cat.
 * @returns {boolean} Returns true if insertion was successful.
 */
export const insertCat = async (catData: CatInterface): Promise<boolean> => {
  const catsCollection = getCatsCollection();
  const res = await catsCollection.insertOne(catData);
  return res.acknowledged;
};

/**
 * Update imageUrl of single cat.
 * @param catId - ID of cat.
 * @returns {boolean} Returns true if update was successful.
 */
export const updateImageUrl = async (catId: string, newUrl: string) => {
  const catsCollection = getCatsCollection();
  const res = await catsCollection.findOneAndUpdate(
    { catId },
    {
      $set: { imageUrl: newUrl },
    }
  );
  if (res.ok) {
    return true;
  }
  return false;
};
