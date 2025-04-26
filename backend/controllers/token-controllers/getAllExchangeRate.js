import { getAllExchangeRate } from "../../methods/query/getAllExchangeRate.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getAllExchangeRateHandler = async (req, res) => {
  try {
    const exchangeRates = await getAllExchangeRate();

    sendSuccess(
      res,
      { exchangeRates },
      "fetched all exchange rate successfully"
    );
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
