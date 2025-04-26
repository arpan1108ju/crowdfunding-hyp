import { sendSuccess } from "../../utils/responses.js";

export const dummyHandler = async (req, res) => {
  sendSuccess(res);
};
