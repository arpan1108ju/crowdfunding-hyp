import { sendSuccess, sendError } from "../../utils/responses.js";
import { createCampaign } from "../../methods/invoke/createCampaign.js";

export const createCampaignHandler = async (req, res) => {
  try {
    const data = req.body;
    const result = await createCampaign({
      id: data.id,
      title: data.title,
      // description: data
    });
    sendSuccess(res, result, "Campaign created successfully!");
  } catch (error) {
    sendError(res, error, "Failed to create campaign.");
  }
};
