import { File } from "@google-cloud/storage";
import { CatError, HelperError } from "../../util/errorHandler";

const SIGNED_URL_DURATION = 24 * 60 * 60 * 1000;

/**
 * Generate a signed URL for file in bucket.
 * @param {File} file - File to generate signed URL for.
 * @returns {string} - Newly generated Signed URL.
 */
export const getSignedUrl = async (file: File): Promise<string> => {
  try {
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + SIGNED_URL_DURATION,
    });

    return signedUrl;
  } catch (e: any) {
    if (e instanceof CatError) {
      throw e;
    } else {
      throw new HelperError(e.message);
    }
  }
};

/**
 * Check if signed URL has expired.
 * @param url - Signed URL to check.
 * @param offset - Minimum duration (in seconds) remaining before a new signed URL should be generated.
 * @returns {boolean} - Returns true if URL has expired and false otherwise.
 */
export const checkUrlExpired = (url: string, offset: number): boolean => {
  try {
    const urlParams = url.split("&");

    const urlCreatedISO = urlParams
      .find((param) => param.startsWith("X-Goog-Date"))
      ?.replace("X-Goog-Date=", "");
    const urlDuration = urlParams
      .find((param) => param.startsWith("X-Goog-Expires"))
      ?.replace("X-Goog-Expires=", "");

    if (!urlCreatedISO || !urlDuration) {
      throw new HelperError("Signed URL format error.");
    }
    const reformattedISO = `${urlCreatedISO.substring(
      0,
      4
    )}-${urlCreatedISO.substring(4, 6)}-${urlCreatedISO.substring(
      6,
      8
    )}T${urlCreatedISO.substring(9, 11)}:${urlCreatedISO.substring(
      11,
      13
    )}:${urlCreatedISO.substring(13)}`;

    const urlCreatedDate = new Date(reformattedISO);
    const urlAdjustedExpiryDate = urlCreatedDate.setSeconds(
      urlCreatedDate.getSeconds() + Number(urlDuration) - offset
    );
    return urlAdjustedExpiryDate <= Date.now();
  } catch (e: any) {
    if (e instanceof CatError) {
      throw e;
    } else {
      throw new HelperError(e.message);
    }
  }
};
