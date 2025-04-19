import { sendSuccess, sendError } from "../../utils/responses.js";
import { getAllCampaigns } from "../../methods/query/getAllCampaigns.js"


export const getAllCampaignsHandler = async (req, res) => {

  try {
    const result = await getAllCampaigns();
    sendSuccess(res, result, "Fetched campaign details successfully!");
  }  catch (error) {
    // Catch and handle CustomError
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
