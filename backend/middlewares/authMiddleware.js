import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { CustomError } from "../utils/customError.js";
import { sendError } from "../utils/responses.js";
import { requestContext } from "../utils/requestContext.js";
import { AUTH_TOKEN_NAME } from "../constants.js";

export const authMiddleware = (req, res, next) => {

  const token = req.cookies[AUTH_TOKEN_NAME];

  if (!token) {
    throw new CustomError("Access token missing", 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request


    const context = requestContext.get();
    if (context) {
      context.user = req.user;
    }



    if (!decoded.isVerified) {
      throw new CustomError("Not verifed", 403);
    }

    next();
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
