import { getContract } from "../../contract/contract.js";
import { GET_ALL_EXCHANGE_RATE, GET_EXCHANGE_RATE } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const getAllExchangeRate = async () => {
  await connectToGateway();
  const contract = await getContract();
  const result = await contract.evaluateTransaction(GET_ALL_EXCHANGE_RATE);
  return result ? JSON.parse(result.toString()) : null;
};

