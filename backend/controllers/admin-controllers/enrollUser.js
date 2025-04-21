import { sendSuccess, sendError } from "../../utils/responses.js";
import db from "../../utils/db.js";
import { CustomError } from "../../utils/customError.js";

import { getCurrentUser } from "../../utils/getCurrentUser.js";
import { enroll } from "../../enroll/enrollment.js";
import { FabricRoles } from "../../constants.js";

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

    // call enroll user here

    const admin = await getCurrentUser();

    const updatedUser = await enroll(admin,existingUser,FabricRoles.CLIENT);
    // Step 3: Send success response
    sendSuccess(res, updatedUser, "User successfully enrolled (verified).");
  } catch (error) {
    sendError(res, error.details || error.message , error.message, error.statusCode || 500);
  }
};

