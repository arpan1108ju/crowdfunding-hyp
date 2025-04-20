import { setAdmin } from "../../methods/invoke/setAdmin.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const setAdminHandler = async (req, res) => {
  try {
    const result = await setAdmin();
    sendSuccess(res, {result}, "set admin successfully");
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
