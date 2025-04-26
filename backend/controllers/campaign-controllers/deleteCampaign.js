import { deleteCampaign } from "../../methods/invoke/deleteCampaign.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const deleteCampaignHandler = async (req, res) => {
  try {
      
      const { id } = req.params;
  
      const responseMessage = await deleteCampaign({id});
  
      sendSuccess(res,{},responseMessage);
    } catch (error) {
      sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
