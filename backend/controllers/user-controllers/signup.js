import { signupSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendError, sendSuccess } from "../../utils/responses.js";
import { SALT_LENGTH, JWT_SECRET, EXP_TIME } from "../../config.js";

export const signup = async (req, res) => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError("Invalid data", 400, validation.error.errors);
    }

    const { username, email, password } = validation.data;

    // Check for duplicate user
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new CustomError("Email already in use!", 400);
      }
      if (existingUser.username === username) {
        throw new CustomError("Username already taken!", 400);
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_LENGTH);

    // Create the user
    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        username: true,
        email: true,
      },
    });

    //  Create JWT Token
    const token = jwt.sign(
      { email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: EXP_TIME } // token valid for 7 days
    );

    //  Send success response with token
    sendSuccess(res,{user,token}, "Signup successful!" );

  } catch (error) {
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
