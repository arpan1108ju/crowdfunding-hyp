import { Role } from "@prisma/client";
import { changeRoleSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const changeRole = async (req, res) => {
    try {

        const {id} = req.params;

        const validation = changeRoleSchema.safeParse(req.body);
    
        if (!validation.success) {
            throw new CustomError("Invalid data", 400, validation.error.errors);
        }
    
        const { role } = validation.data; 

        const existingUser = await db.user.findUnique({
            where : {
                id
            },
            select : {
                id : true,
                role : true
            }
        })

        if(!existingUser){
            throw new CustomError("User not found",404);
        }
        if(existingUser.role === Role.SUPERADMIN){
            throw new CustomError("Superadmin cannot be revoked",403);
        }

        const updatedUser = await db.user.update({
            where : {
                id
            },
            data : {
                role : role
            }
            ,
            select : {
                id : true,
                role : true
            }
        })

        sendSuccess(res,updatedUser , "role updated successfully!");
    } catch (error) {
      // Catch and handle CustomError
      sendError(res, error.details || error.message, error.message, error.statusCode || 500);
    }
};
