import { sendSuccess, sendError } from "../../utils/responses.js";
import { getCurrentUser } from "../../utils/getCurrentUser.js";

import { reenroll } from "../../enroll/reenrollment.js";
import db from "../../utils/db.js";

export const reEnrollUser = async (req, res) => {
  try {

    const user = await getCurrentUser();

    const fullUser = await db.user.findUnique({
        where : {
            email : user.email
        }
    })

    const updatedUser = await reenroll(fullUser);
    // Step 3: Send success response
    sendSuccess(res, updatedUser, "User successfully reenrolled (verified).");
  } catch (error) {
    sendError(res, error.details || error.message , error.message, error.statusCode || 500);
  }
};

