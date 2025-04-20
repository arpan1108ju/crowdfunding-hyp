
import { sendError, sendSuccess } from "../../utils/responses.js";

import { getBalance } from "../../methods/query/getBalance.js";

export const getBalanceHandler = async (req, res) => {
  try {
    
    const balance = await getBalance();

    sendSuccess(res,balance, "Get balance successfully.");

  } catch (error) {
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
