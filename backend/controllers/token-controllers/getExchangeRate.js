import { getExchangeRate } from "../../methods/query/getExchangeRate.js";
import { currencySchema } from "../../utils/apiSchema.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getExchangeRateHandler = async (req, res) => {
  try {
    const { currency } = req.query;

    const validation = currencySchema.safeParse(currency);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const currencyData = validation.data;
    const exchangeRate = await getExchangeRate({ currency: currencyData });

    sendSuccess(res, { exchangeRate }, "fetched exchange rate successfully");
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
