import { signupSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const signup = async (req, res) => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError("Invalid data", 400, validation.error.errors);
    }

    const {username , email , password} = validation.data;
    

    // do signup

    // Create user in the database
    const user = await db.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    sendSuccess(res, { message: "Signup successful!" },user);
  } catch (error) {
    // Catch and handle CustomError
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
