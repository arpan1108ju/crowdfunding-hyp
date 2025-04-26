import { Role } from "@prisma/client";
import db from "../../utils/db.js";
import { sendError, sendSuccess } from "../../utils/responses.js";
import { FabricRoles } from "../../constants.js";
import { getCurrentUser } from "../../utils/getCurrentUser.js";
import { enroll } from "../../enroll/enrollment.js";
import { CustomError } from "../../utils/customError.js";

export const enrollAdminHandler = async (req, res) => {
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
        throw new CustomError("Identity user is not admin",403);
    }

    const updatedAdmin = await enroll(superadmin,existingAdmin,FabricRoles.ADMIN);
    
    sendSuccess(res,updatedAdmin, 'Successfully enrolled admin');
  } catch (error) {
    // Catch and handle CustomError
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};

