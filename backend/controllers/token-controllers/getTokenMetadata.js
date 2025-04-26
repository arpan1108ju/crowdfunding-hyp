import { getTokenMetadata } from "../../methods/query/getTokenMetadata.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getTokenMetadataHandler = async (req, res) => {
  try {

    const tokenMetadata = await getTokenMetadata();
    sendSuccess(res, {tokenMetadata}, "fetched token metadata successfully");
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
