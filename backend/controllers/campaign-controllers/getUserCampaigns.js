import { sendSuccess, sendError } from "../../utils/responses.js";
import { getUserCampaigns } from "../../methods/query/getUserCampaigns.js";
import db from "../../utils/db.js";


export const getUserCampaignsHandler = async (req, res) => {
  try {


    const result = await getUserCampaigns();
    
    const responseToReturn = await Promise.all((
      result.map(async(camp) => {

         const { ownerDbId,donors,...rest } = camp;
         const owner = await db.user.findFirst({
           where : {
              id : ownerDbId
           },
           select : {
             id : true,
             username : true
           }
         })
         return { owner,numDonors : donors.length,...rest };
      })
   ))

    sendSuccess(res, responseToReturn, "Fetched campaign details successfully!");
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
