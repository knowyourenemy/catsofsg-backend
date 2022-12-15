import { Db, Collection } from "mongodb";
import { getDbConnection } from "../connect";

export interface CatInterface {
  name: string;
  colour: string;
  imageUrl: string;
  imageName: string;
  catId: string;
}

export const getCatsCollection = (): Collection<CatInterface> => {
  const db = getDbConnection();
  return db.collection<CatInterface>(
    process.env.CATS_COLLECTION_NAME || "cat_collection"
  );
};

export const getAllCats = async (
  catCollection: Collection<CatInterface>
): Promise<CatInterface[]> => {
  const res = await catCollection.find().toArray();
  return res;
};

export const insertCat = async (
  catCollection: Collection<CatInterface>,
  catData: CatInterface
): Promise<boolean> => {
  const res = await catCollection.insertOne(catData);
  return res.acknowledged;
};
