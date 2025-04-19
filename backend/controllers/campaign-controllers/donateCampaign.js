import { donateToCampaign } from "../../methods/invoke/donateToCampaign.js";
import { donateCampaignSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const donateCampaignHandler = async (req, res) => {
  try {
    const validation = donateCampaignSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError("Invalid data", 400, validation.error.errors);
    }

    const { amount } = validation.data;

    const { id } = req.params;

    const donationObj = {
      id,
      amount : amount.toString(),
      timestamp : Date.now().toString()
    }

    const responseMessage = await donateToCampaign(donationObj);

    sendSuccess(res,donationObj,responseMessage);
  } catch (error) {
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
