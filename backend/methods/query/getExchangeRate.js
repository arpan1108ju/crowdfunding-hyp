import { getContract } from "../../contract/contract.js";
import { GET_EXCHANGE_RATE } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const getExchangeRate = async ({currency}) => {
  await connectToGateway();
  const contract = await getContract();
  const result = await contract.evaluateTransaction(GET_EXCHANGE_RATE,currency);
  return result ? JSON.parse(result.toString()) : null;
};

