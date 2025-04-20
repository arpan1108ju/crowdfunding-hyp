import { getContract } from "../../contract/contract.js";
import { GET_TOKEN_METADATA } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const getTokenMetadata = async () => {
  await connectToGateway();
  const contract = await getContract();
  const result = await contract.evaluateTransaction(GET_TOKEN_METADATA);
  return result ? JSON.parse(result.toString()) : null;
};
