import { getContract } from "../../contract/contract.js";
import { SET_TOKEN_METADATA } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const setTokenMetadata = async ({ name, symbol }) => {
  await connectToGateway();
  const contract = await getContract();

  const result = await contract.submitTransaction(
    SET_TOKEN_METADATA,
    name,
    symbol
  );

  return result ? JSON.parse(result.toString()) : null;
};
