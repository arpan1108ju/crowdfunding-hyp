import { sendSuccess, sendError } from "../../utils/responses.js";
import db from "../../utils/db.js";
import { CustomError } from "../../utils/customError.js";



export const fetchAllUser = async (req, res) => {
  try {
    const { verify } = req.query;

    if (verify === undefined) {
      throw new CustomError("Missing 'verify' query parameter", 400);
    }

    // Convert string to boolean (query params are strings by default)
    const isVerified = verify === "true";

    const users = await db.user.findMany({
      where: { verified: isVerified },
      select: {
        id: true,
        username: true,
        email: true,
        verified: true,
        createdAt: true
      }
    });

    sendSuccess(res, users, "Users fetched successfully!");
  } catch (error) {
    sendError(res, error.details || {}, error.message, error.statusCode || 500);
  }
};
