import { getContract } from "../../contract/contract.js";
import { UNREGISTER_USER } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const unregisterUser = async ({ user }) => {
  await connectToGateway({ enrollViaUser: user });
  const contract = await getContract();

  const result = await contract.submitTransaction(UNREGISTER_USER, user.id);

  return result ? JSON.parse(result.toString()) : null;
};
