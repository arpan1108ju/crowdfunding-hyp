import { sendSuccess, sendError } from "../../utils/responses.js";
import { CustomError } from "../../utils/customError.js";

export const enrollUser = async (req, res) => {
  try {
    sendSuccess(res,{},"Enroll successfull");
  } catch (error) {
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
