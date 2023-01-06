import { getCatsCollection } from "../db";
import { DbError, NotFoundError, CatError } from "../util/errorHandler";

export interface CatInterface {
  name: string;
  sex: string;
  imageUrl: string;
  imageName: string;
  catId: string;
  position: {
    lng: number;
    lat: number;
  };
  community: string;
  likes?: string;
  dislikes?: string;
  personality?: string;
  other?: string;
  dateCreated: number;
  dateModified: number;
  approved: boolean;
}

export interface CatPreviewInterface {
  catId: string;
  community: string;
  name: string;
}

/**
 * Get all cat documents.
 * @returns {CatInterface[]} Array of cat documents.
 */
export const getAllCats = async (): Promise<CatPreviewInterface[]> => {
  try {
    const catsCollection = getCatsCollection();
    const res = await catsCollection
      .find(
        { approved: true },
        {
          projection: {
            _id: 0,
            catId: 1,
            community: 1,
            name: 1,
          },
        }
      )
      .toArray();
    return res;
  } catch (e: any) {
    if (e instanceof CatError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Get single cat document.
 * @param catId - ID of cat
 * @returns {CatInterface} Cat document.
 */
export const getSingleCat = async (catId: string): Promise<CatInterface> => {
  try {
    const catsCollection = getCatsCollection();
    const res = await catsCollection.findOne(
      { catId, approved: true },
      {
        projection: {
          _id: 0,
          position: 0,
          approved: 0,
        },
      }
    );
    if (!res) {
      throw new NotFoundError(`Could not find cat with ID ${catId}.`);
    }
    return res;
  } catch (e: any) {
    if (e instanceof CatError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Insert cat into DB and GCP bucket.
 * @param catData - Cat document.
 * @returns {void}
 */
export const insertCat = async (catData: CatInterface): Promise<void> => {
  try {
    const catsCollection = getCatsCollection();
    const res = await catsCollection.insertOne(catData);
    if (!res.acknowledged) {
      throw new DbError(`Could not insert cat with ID ${catData.catId}.`);
    }
  } catch (e: any) {
    if (e instanceof CatError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};

/**
 * Update imageUrl of single cat.
 * @param catId - ID of cat.
 * @returns {void}
 */
export const updateImageUrl = async (catId: string, newUrl: string) => {
  try {
    const catsCollection = getCatsCollection();
    const res = await catsCollection.findOneAndUpdate(
      { catId },
      {
        $set: { imageUrl: newUrl },
      }
    );
    if (!res.ok) {
      throw new DbError(`Could not update image URL for cat with ID ${catId}.`);
    }
  } catch (e: any) {
    if (e instanceof CatError) {
      throw e;
    } else {
      throw new DbError(e.message);
    }
  }
};
