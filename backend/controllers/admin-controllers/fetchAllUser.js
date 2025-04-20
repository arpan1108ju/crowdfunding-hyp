import { sendSuccess, sendError } from "../../utils/responses.js";
import db from "../../utils/db.js";
import { CustomError } from "../../utils/customError.js";



export const fetchAllUser = async (req, res) => {
    try {
      const { verified } = req.query;
  
      if (verified === undefined) {
        throw new CustomError("Missing 'verify' query parameter", 400);
      }
  
      const isVerified = verified === "true";
  
      const users = await db.user.findMany({
        where: { isVerified: isVerified },
        select: {
          id: true,
          username: true,
          email: true,
          isVerified: true,  // ✅ correct field name
          createdAt: true
        }
      });
  
      sendSuccess(res, users, "Users fetched successfully!");
    } catch (error) {
      sendError(res, error.details || {}, error.message, error.statusCode || 500);
    }
  };
  