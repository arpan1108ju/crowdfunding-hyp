import { sendSuccess, sendError } from "../../utils/responses.js";
import { createCampaign } from "../../methods/invoke/createCampaign.js";
import { createCampaignSchema } from "../../utils/apiSchema.js";
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from "../../utils/customError.js";

export const createCampaignHandler = async (req, res) => {
  try {
    const validation = createCampaignSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError("Invalid data", 400, validation.error.errors);
    }

    const { title, description, campaignType, target, deadline, image } = validation.data;

    const id = uuidv4();

    const campaignObj = {
      id,
      title,
      description,
      campaignType,
      target : target.toString(),
      deadline : deadline.toString(),
      image,
      createdAt : Date.now().toString()
    }

    const responseMessage = await createCampaign(campaignObj);

    sendSuccess(res,campaignObj,responseMessage);
  } catch (error) {
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
