import { sendSuccess, sendError } from "../../utils/responses.js";

import db from "../../utils/db.js";
import { CustomError } from "../../utils/customError.js";

export const fetchOneUser = async (req, res) => {
    try {
      const {id} = req.params; // extract query param
      if (!id) {
        throw new CustomError("ID is required", 400);
      }
  
      const user = await db.user.findUnique({
        where: { id },
        select : {
           id : true,
           username : true,
           email : true,
           isVerified : true,
           role : true,
           createdAt : true
        }
      });
  
      if (!user) {
        throw new CustomError("User not found", 404);
      }
  
      sendSuccess(res, user, "User fetched successfully!");
    } catch (error) {
      sendError(res, error.details || {}, error.message, error.statusCode || 500);
    }
  };
  