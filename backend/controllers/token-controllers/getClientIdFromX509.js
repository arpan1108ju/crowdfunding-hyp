import { getClientIdFromX509 } from "../../methods/query/getClientIdfromX509.js";
import { x509Schema } from "../../utils/apiSchema.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getClientIdFromX509Handler = async (req, res) => {
  try {
    const validation = x509Schema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const x509Identity = validation.data;

    console.log("req : ", x509Identity);

    const clientId = await getClientIdFromX509(x509Identity);

    console.log("res : ", clientId);

    sendSuccess(res, { clientId }, "fetched client ID successfully");
  } catch (error) {
    // Catch and handle CustomError
    sendError(
      res,
      error.details || error.message,
      error.message,
      error.statusCode || 500
    );
  }
};
