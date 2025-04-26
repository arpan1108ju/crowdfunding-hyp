import { getBalance } from "../../methods/query/getBalance.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getBalanceHandler = async (req, res) => {
  try {
    const balance = await getBalance();
    sendSuccess(res, {balance}, "fetched balance successfully");
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
