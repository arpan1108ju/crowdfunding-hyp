import { Role } from "@prisma/client";
import db from "../../utils/db.js";
import { sendError, sendSuccess } from "../../utils/responses.js";
import { FabricRoles } from "../../constants.js";
import { getCurrentUser } from "../../utils/getCurrentUser.js";
import { CustomError } from "../../utils/customError.js";
import { revoke } from "../../enroll/revocation.js";

export const revokeAdminHandler = async (req, res) => {
  try {
    
    const { id } = req.params;
    
    const existingAdmin = await db.user.findUnique({
        where : {
            id
        }
    })

    if(!existingAdmin){
        throw new CustomError("Given admin not found",404);
    }

    const superadmin = await getCurrentUser();

    if(existingAdmin.role !== Role.ADMIN){
        throw new CustomError("Given user is not admin",403);
    }

    const updatedAdmin = await revoke(superadmin,existingAdmin,FabricRoles.ADMIN);
    
    sendSuccess(res,updatedAdmin, 'Revoked admin Successfully');
  } catch (error) {
    // Catch and handle CustomError
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};

