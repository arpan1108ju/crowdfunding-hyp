import { sendSuccess, sendError } from "../../utils/responses.js";
import db from "../../utils/db.js";
import { CustomError } from "../../utils/customError.js";
import { verifiedSchema } from "../../utils/apiSchema.js";

export const fetchAllUser = async (req, res) => {
  try {
    const { verified } = req.query;

    const validation = verifiedSchema.safeParse(verified);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    // if (verified === undefined || verified === "true" || verified === "false") {
    //   throw new CustomError("Missing 'verify' query parameter", 400);
    // }

    let isVerified = null;
    if (verified === "true") isVerified = true;
    else if (verified === "false") isVerified = false;

    let users;

    if (isVerified === null) {
      users = await db.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          isRevoked : true
        },
      });
    } else {
      users = await db.user.findMany({
        where: { isVerified },
        select: {
          id: true,
          email: true,
          role: true,
          isVerified: true,
          isRevoked : true
        },
      });
    }

    sendSuccess(res, users, "Users fetched successfully!");
  } catch (error) {
    sendError(res, error.details || {}, error.message, error.statusCode || 500);
  }
};
