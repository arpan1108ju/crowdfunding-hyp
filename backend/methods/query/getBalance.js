import { getContract } from "../../contract/contract.js";
import { GET_BALANCE } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const getBalance = async () => {
  await connectToGateway();
  const contract = await getContract();
  const result = await contract.evaluateTransaction(GET_BALANCE);
  return result ? JSON.parse(result.toString()) : null;
};
