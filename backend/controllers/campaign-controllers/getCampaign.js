import { getCampaign } from "../../methods/query/getCampaign.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";
import { sendError, sendSuccess } from "../../utils/responses.js";

export const getCampaignHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getCampaign({ id });

    if (!result) {
      throw new CustomError("Campaign not found", 404);
    }

    const { donors, ownerDbId, ...rest } = result;

    // Use Promise.all to await all donor username lookups
    const donorWithNames = await Promise.all(
      donors.map(async (donor) => {
        const user = await db.user.findFirst({
          where: {
            id: donor.donorDbId,
          },
          select: {
            id: true,
            username: true,
          },
        });
        return { donor: user.username, donation: donor.donationAmount };
      })
    );

    const owner = await db.user.findFirst({
      where: {
        id: ownerDbId,
      },
      select: {
        id: true,
        username: true,
      },
    });

    const responseBody = { donors : donorWithNames, owner, ...rest };

    // console.log('res 1 : ',responseBody);

    sendSuccess(res, responseBody, "Fetched campaign details successfully!");
  } catch (error) {
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};
