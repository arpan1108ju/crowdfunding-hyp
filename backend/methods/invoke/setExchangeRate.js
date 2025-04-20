import { getContract } from "../../contract/contract.js";
import { SET_EXCHANGE_RATE } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const setExchangeRate = async ({
  currency,
  rate
}) => {
  await connectToGateway();
  const contract = await getContract();

  const result = await contract.submitTransaction(
    SET_EXCHANGE_RATE,
    currency,
    rate
  );

  
  return result ? JSON.parse(result.toString()) : null;

};
