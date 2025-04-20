import { sendSuccess, sendError } from "../../utils/responses.js";

import db from "../../utils/db.js";
import { CustomError } from "../../utils/customError.js";

export const fetchOneUser = async (req, res) => {
    try {
      const email = req.query.email; // extract query param
      if (!email) {
        throw new CustomError("Email is required", 400);
      }
  
      const user = await db.user.findUnique({
        where: { email }
      });
  
      if (!user) {
        throw new CustomError("User not found", 404);
      }
  
      sendSuccess(res, user, "User fetched successfully!");
    } catch (error) {
      sendError(res, error.details || {}, error.message, error.statusCode || 500);
    }
  };
  