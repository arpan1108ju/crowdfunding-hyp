import { sendSuccess, sendError } from "../../utils/responses.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";

export const revokeUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // Delete the user
    await db.user.delete({
      where: { id }
    });

    sendSuccess(res, {}, "User revoked (deleted) successfully!");
  } catch (error) {
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
