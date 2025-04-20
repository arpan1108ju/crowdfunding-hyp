import { getContract } from "../../contract/contract.js";
import { SET_ADMIN } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const setAdmin = async () => {
  await connectToGateway();
  const contract = await getContract();

  const result = await contract.submitTransaction(
    SET_ADMIN
  );

  return result ? JSON.parse(result.toString()) : null;

};
