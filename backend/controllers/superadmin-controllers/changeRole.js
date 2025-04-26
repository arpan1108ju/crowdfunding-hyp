import { Role } from "@prisma/client";
import { changeRoleSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const changeRole = async (req, res) => {
  try {
    const { id } = req.params;

    const validation = changeRoleSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const { role } = validation.data;

    const existingUser = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        role: true,
        isVerified: true,
        isRevoked : true
      },
    });

    if (!existingUser) {
      throw new CustomError("User not found", 404);
    } 
    else if(existingUser.isVerified){
      throw new CustomError("Cannot change role of an enrolled identity",403);
    }
    else if(existingUser.isRevoked){
      throw new CustomError("Cannot change role of an revoked identity",403);
    }

    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        role: role,
      },
      select: {
        id: true,
        role: true,
      },
    });

    sendSuccess(res, updatedUser, "role updated successfully!");
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
