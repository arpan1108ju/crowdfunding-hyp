import { sendSuccess, sendError } from "../../utils/responses.js";

import { AUTH_TOKEN_NAME } from "../../constants.js";

export const logout = async (req, res) => {
  try {
    res.clearCookie(AUTH_TOKEN_NAME, {
        httpOnly: true,
        secure: true,       // use true in production with HTTPS
        sameSite: 'strict',
        path: '/',          // must match the original path
    });
    sendSuccess(res, {}, "Login successful!");
  } catch (error) {
    sendError(res, error.details || {}, error.message, error.statusCode || 500);
  }
};
