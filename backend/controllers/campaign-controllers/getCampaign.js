import { getCampaign } from "../../methods/query/getCampaign.js";
import { CustomError } from "../../utils/customError.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getCampaignHandler = async (req, res) => {
  try {

    const { id } = req.params;
    console.log(id);
    
    const result = await getCampaign({id});

    if(!result){
       throw new CustomError("Campaign not found",404);
    }

    sendSuccess(res, result, "Fetched campaign details successfully!");
  }  catch (error) {
    // Catch and handle CustomError
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
