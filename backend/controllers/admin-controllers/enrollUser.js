import { sendSuccess, sendError } from "../../utils/responses.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";

export const enrollUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new CustomError("User not found", 404);
    }

    // Step 2: Update isVerified to true
    const updatedUser = await db.user.update({
      where: { id },
      data: { isVerified: true },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
      }
    });

    // Step 3: Send success response
    sendSuccess(res, updatedUser, "User successfully enrolled (verified).");
  } catch (error) {
    sendError(res, error.details || {}, error.message, error.statusCode || 500);
  }
};
