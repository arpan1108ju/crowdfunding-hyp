import { sendSuccess, sendError } from "../../utils/responses.js";
import { getUserCampaigns } from "../../methods/query/getUserCampaigns.js";

export const getUserCampaignsHandler = async (req, res) => {
  try {


    const result = await getUserCampaigns();
    sendSuccess(res, result, "Fetched campaign details successfully!");
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
