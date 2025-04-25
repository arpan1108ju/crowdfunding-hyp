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
      select : {
        username: true,
        email: true,
        isVerified: true,
        role : true,
        password : true
      }
    });

    if (!existingUser) {
      throw new CustomError("Email not registered!", 404);
    }

    // Now check if x509Identity exists
    const x509 = await db.user.findUnique({
      where: { email },
      select: { x509Identity: true }
    });

    if (x509?.x509Identity) {
      existingUser.x509Identity = x509.x509Identity;
    }

    const {password : dbPassword , ...user} = existingUser;

    //  Compare entered password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, dbPassword);

    if (!isPasswordValid) {
      throw new CustomError("Invalid password!", 401);
    }


    //  Create JWT Token
    const token = jwt.sign(
      user,
      JWT_SECRET,
      { expiresIn: EXP_TIME } // token valid for 7 days
    );

    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    sendSuccess(res, {user,token}, "Login successful!");
  } catch (error) {
    sendError(res, error.details || {}, error.message, error.statusCode || 500);
  }
};
