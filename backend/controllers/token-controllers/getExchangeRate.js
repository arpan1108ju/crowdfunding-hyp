import { getExchangeRate } from "../../methods/query/getExchangeRate.js";
import { getExchangeRateSchema } from "../../utils/apiSchema.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getExchangeRateHandler = async (req, res) => {
  try {
    const validation = getExchangeRateSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError("Invalid data", 400, validation.error.errors);
    }

    const { currency } = validation.data;
    const exchangeRate = await getExchangeRate({ currency });
    sendSuccess(res, exchangeRate, "fetched balance successfully");
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
