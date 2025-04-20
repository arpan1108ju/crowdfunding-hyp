import { sendSuccess, sendError } from "../../utils/responses.js";


export const revokeUser = async (req, res) => {
  try {
    sendSuccess(res,{},"Revoke successfull!");
  } catch (error) {
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
