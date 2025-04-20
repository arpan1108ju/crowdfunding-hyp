import { getTokenMetadata } from "../../methods/query/getTokenMetadata.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getTokenMetadataHandler = async (req, res) => {
  try {
    const tokenMetadata = await getTokenMetadata({ currency });
    sendSuccess(res, tokenMetadata, "fetched balance successfully");
  } catch (error) {
    // Catch and handle CustomError
    sendError(
      res,
      error.details || error.message,
      error.message,
      error.statusCode || 500
    );
  }
};
