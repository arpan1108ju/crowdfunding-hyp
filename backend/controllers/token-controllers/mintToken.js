import { mintToken } from "../../methods/invoke/mintToken.js";
import { mintTokenSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import { sendError, sendSuccess } from "../../utils/responses.js";
import db from "../../utils/db.js";
export const mintTokenHandler = async (req, res) => {
  try {

    // throw new CustomError("Not possible to call directly. call via /user/payments");

    const validation = mintTokenSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const { currency, amountPaid,paymentId } = validation.data;

    console.log('payment id : ',paymentId);

    const tokensToMint = await mintToken({ currency, amountPaid });

    const updatedPayment = await db.payment.update({
      where : {
        id : paymentId
      },
      data : {
        tokenMinted : tokensToMint,
        status : "success"
      }
    })


    sendSuccess(res, { updatedPayment }, "minting token successful!");
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
