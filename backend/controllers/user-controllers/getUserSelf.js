import { sendSuccess, sendError } from "../../utils/responses.js";
import { getCurrentUser } from "../../utils/getCurrentUser.js";

import db from "../../utils/db.js";

export const getUserSelf = async (req, res) => {
  try {
    const user = await getCurrentUser();

    const fullUser = await db.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role : true,
        isRevoked: true,
        isVerified: true,
        x509Identity: true,
        credentials: true,
        createdAt: true,
        secret: true,
        x509Identity : true
      },
    });

    sendSuccess(res, fullUser, "User successfully reenrolled (verified).");
  } catch (error) {
    sendError(
      res,
      error.details || error.message,
      error.message,
      error.statusCode || 500
    );
  }
};
