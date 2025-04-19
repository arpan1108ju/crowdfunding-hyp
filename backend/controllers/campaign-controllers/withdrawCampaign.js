import { withdrawCampaign } from "../../methods/invoke/withdrawCampaign.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const withdrawCampaignHandler = async (req, res) => {
  try {
    
  
      const { id } = req.params;
  
      const withdrawObj = {
        id,
        timestamp : Date.now().toString()
      }
  
      const responseMessage = await withdrawCampaign(withdrawObj);
  
      sendSuccess(res,withdrawObj,responseMessage);
    } catch (error) {
      sendError(res, error.details || error.message, error.message, error.statusCode || 500);
    }
};
