import { setTokenMetadata } from "../../methods/invoke/setTokenMetadata.js";
import { setTokenMetadataSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const setTokenMetadataHandler = async (req, res) => {
  try {
    const validation = setTokenMetadataSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const { name, symbol } = validation.data;

    const result = await setTokenMetadata({ name, symbol });

    sendSuccess(res, { result }, "set token metadata successfully");
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
