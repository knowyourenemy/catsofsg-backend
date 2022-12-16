import { CatInterface, getSingleCat, updateImageUrl } from "../models/cats.db";
import catsBucket from "./gcp/gcp.config";
import { checkUrlExpired, getSignedUrl } from "./gcp/gcp.url";

/**
 * Recieves single cat document. If the image URL has expired, a new URL is generated and the document is updated.
 * @param catId - ID of cat to retrieve.
 * @returns {CatInterface} Cat document.
 */
export const getCatWithImageUrl = async (
  catId: string
): Promise<CatInterface> => {
  const catData = await getSingleCat(catId);

  if (checkUrlExpired(catData.imageUrl, 5 * 60)) {
    const blob = catsBucket.file(catData.imageName);
    const signedUrl = await getSignedUrl(blob);
    await updateImageUrl(catData.catId, signedUrl);

    return {
      ...catData,
      imageUrl: signedUrl,
    };
  } else {
    return catData;
  }
};
