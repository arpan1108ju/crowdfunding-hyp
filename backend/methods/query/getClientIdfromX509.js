import { getContract } from "../../contract/contract.js";
import { GET_BALANCE, GET_CLIENT_ID_FROM_X509 } from "../../constants.js";
import { connectToGateway } from "../../gateway/connect.js";

export const getClientIdFromX509 = async (x509Identity) => {
  await connectToGateway();
  const contract = await getContract();
  const result = await contract.evaluateTransaction(GET_CLIENT_ID_FROM_X509,JSON.stringify(x509Identity));
  
  
  return result ? result.toString() : null;
};
