import { sendSuccess, sendError } from "../../utils/responses.js";
import { getCurrentUser } from "../../utils/getCurrentUser.js";

import db from "../../utils/db.js";

export const getAllUserPayments = async (req, res) => {
  try {
    const user = await getCurrentUser();

    const fullUser = await db.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        id: true
      },
    });

    const payments = await db.payment.findMany({
        where : {
            userId : fullUser.id
        }
    })

    sendSuccess(res, payments , "User successfully reenrolled (verified).");
  } catch (error) {
    sendError(
      res,
      error.details || error.message,
      error.message,
      error.statusCode || 500
    );
  }
};
