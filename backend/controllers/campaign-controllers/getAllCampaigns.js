import { sendSuccess, sendError } from "../../utils/responses.js";
import { getAllCampaigns } from "../../methods/query/getAllCampaigns.js"


export const getAllCampaignsHandler = async (req, res) => {

  try {
    const result = await getAllCampaigns();
    sendSuccess(res, result, "Fetched campaign details successfully!");
  } catch (error) {
    sendError(res, error,"Failed to fetch campaign details.");
  }
};
