// anywhere, even deep inside service/utility

import { requestContext } from "./requestContext.js";

export const getCurrentUser = () => {
  const context = requestContext.get();
  return context?.user || null;
};
