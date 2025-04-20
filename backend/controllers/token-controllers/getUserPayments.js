
import { getUserPaymentDetails } from "../../methods/query/getUserPaymentDetails.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getUserPaymentsHandler = async (req, res) => {
  try {
    const paymentDetails = await getUserPaymentDetails();
    sendSuccess(res, {paymentDetails}, "Payment details fetched successfully");
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
