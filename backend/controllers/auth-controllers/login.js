import { loginSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";
import jwt from "jsonwebtoken"; // Make sure this line is included
import bcrypt from "bcrypt";
import { sendSuccess, sendError } from "../../utils/responses.js";
import { JWT_SECRET, EXP_TIME } from "../../config.js";

export const login = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError("Invalid data", 400, validation.error.errors);
    }

    const { email, password } = validation.data;

    //  Find user by email
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new CustomError("Email not registered!", 404);
    }

    //  Compare entered password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      throw new CustomError("Invalid password!", 401);
    }

    // Send success response (omit password)
    const user = {
      username: existingUser.username,
      email: existingUser.email,
      isVerified : existingUser.isVerified
    };

    //  Create JWT Token
    const token = jwt.sign(
      user,
      JWT_SECRET,
      { expiresIn: EXP_TIME } // token valid for 7 days
    );

    sendSuccess(res, {user,token}, "Login successful!");
  } catch (error) {
    sendError(res, error.details || {}, error.message, error.statusCode || 500);
  }
};
