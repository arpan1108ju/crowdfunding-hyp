import { DELETE_CAMPAIGN } from "../../constants.js";
import { getContract } from "../../contract/contract.js";
import { connectToGateway } from "../../gateway/connect.js";

export const deleteCampaign = async ({ id , timestamp }) => {
  await connectToGateway();
  const contract = await getContract();

  const result = await contract.submitTransaction(DELETE_CAMPAIGN, id, timestamp);

  return result ? JSON.parse(result.toString()) : null;

};
