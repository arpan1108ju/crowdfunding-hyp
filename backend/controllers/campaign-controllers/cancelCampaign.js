import { cancelCampaign } from "../../methods/invoke/cancelCampaign.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const cancelCampaignHandler = async (req, res) => {
  try {
      const { id } = req.params;
  
      const cancelObj = {
        id,
        timestamp : Date.now().toString()
      }
  
      const responseMessage = await cancelCampaign(cancelObj);
  
      sendSuccess(res,cancelObj,responseMessage);
    } catch (error) {
      sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
