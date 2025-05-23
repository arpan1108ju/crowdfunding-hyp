import { signupSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const func = async (req, res) => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const {} = validation.data;

    sendSuccess(res, { message: "successful!" });
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
