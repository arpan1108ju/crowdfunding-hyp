import { getContract } from "../../contract/contract.js";
import { REGISTER_USER } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const registerUser = async ({user}) => {
  await connectToGateway({enrollViaUser : user});
  const contract = await getContract();

  const timestamp = Date.now().toString();
  const result = await contract.submitTransaction(
    REGISTER_USER,
    user.id,
    timestamp
  );

  
  return result ? JSON.parse(result.toString()) : null;

};
