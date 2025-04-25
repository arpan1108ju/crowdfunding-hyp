import { updateCampaign } from "../../methods/invoke/updateCampaign.js";
import { getCampaign } from "../../methods/query/getCampaign.js";
import { updateCampaignSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const updateCampaignHandler = async (req, res) => {
  try {
    const validation = updateCampaignSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const { title, description, campaignType, target, deadline, image } =
      validation.data;

    const { id } = req.params;

    const existingCampaign = await getCampaign({ id });

    const updateCampaignObj = {
      id: existingCampaign.id,
      title: title ?? existingCampaign.title,
      description: description ?? existingCampaign.description,
      campaignType: campaignType ?? existingCampaign.campaignType,
      target: target ? target.toString() : existingCampaign.target,
      deadline: deadline ? deadline.toString() : existingCampaign.deadline,
      image: image ?? existingCampaign.image,
      timestamp: Date.now().toString(),
    };

    const responseMessage = await updateCampaign(updateCampaignObj);

    sendSuccess(res, updateCampaignObj, responseMessage);
  } catch (error) {
    sendError(
      res,
      error.details || error.message,
      error.message,
      error.statusCode || 500
    );
  }
};
