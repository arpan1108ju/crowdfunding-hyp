import { setExchangeRate } from "../../methods/invoke/setExchangeRate.js";
import { setExchangeRateSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const setExchangeRateHandler = async (req, res) => {
  try {
    const validation = setExchangeRateSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const { currency, rate } = validation.data;

    const result = await setExchangeRate({ currency, rate });

    sendSuccess(res, { result }, "exchange rate set successfully");
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
