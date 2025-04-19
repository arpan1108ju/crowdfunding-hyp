import { getContract } from "../../contract/contract.js";
import { UPDATE_CAMPAIGN } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const updateCampaign = async ({
  id,
  title,
  description,
  campaignType,
  goal,
  deadline,
  image,
  timestamp, // Acts as the current timestamp on update
}) => {
  await connectToGateway();
  const contract = await getContract();

  const result = await contract.submitTransaction(
    UPDATE_CAMPAIGN,
    id,
    title,
    description,
    campaignType,
    goal,
    deadline,
    image,
    timestamp
  );

  return result ? JSON.parse(result.toString()) : null;
};
