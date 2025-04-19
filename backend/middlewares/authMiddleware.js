import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { CustomError } from "../utils/customError.js";
import { sendError } from "../utils/responses.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1]; // Get token after "Bearer"

  if (!token) {
    throw new CustomError("Access token missing", 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (error) {
    // Catch and handle CustomError
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
