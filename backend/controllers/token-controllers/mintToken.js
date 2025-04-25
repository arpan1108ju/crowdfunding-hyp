import { mintToken } from "../../methods/invoke/mintToken.js";
import { mintTokenSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const mintTokenHandler = async (req, res) => {
  try {
    const validation = mintTokenSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const { currency, amountPaid } = validation.data;

    const result = await mintToken({ currency, amountPaid });

    sendSuccess(res, { result }, "minting token successful!");
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
