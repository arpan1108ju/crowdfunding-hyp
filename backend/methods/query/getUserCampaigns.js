import { getContract } from "../../contract/contract.js";
import { GET_USER_CAMPAIGNS } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const getUserCampaigns = async () => {
  await connectToGateway();
  const contract = await getContract();
  const result = await contract.evaluateTransaction(GET_USER_CAMPAIGNS);

  return result ? JSON.parse(result.toString()) : null;
};
