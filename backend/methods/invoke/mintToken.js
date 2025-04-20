import { getContract } from "../../contract/contract.js";
import { MINT_TOKEN } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const mintToken = async ({
 currency,
 amountPaid
}) => {
  await connectToGateway();
  const contract = await getContract();

  const result = await contract.submitTransaction(
    MINT_TOKEN,
    currency,
    amountPaid
  );

  
  return result ? JSON.parse(result.toString()) : null;

};
