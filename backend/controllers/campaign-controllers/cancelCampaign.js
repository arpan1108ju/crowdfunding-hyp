import { sendSuccess } from "../../utils/responses.js";

export const cancelCampaignHandler = async (req, res) => {
  console.log('cancelleing...');
  sendSuccess(res);
};
