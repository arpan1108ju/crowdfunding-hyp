
import {
  CAMPAIGN_CATEGORY,
  CAMPAIGN_CREATED_AT,
  CAMPAIGN_DEADLINE,
  CAMPAIGN_DESC,
  CAMPAIGN_GOAL,
  CAMPAIGN_ID,
  CAMPAIGN_IMAGE,
  CAMPAIGN_TITLE,

} from "./constants.js";
import { disconnectFromGateway } from "./gateway/disconnect.js";
import { createCampaign } from "./methods/invoke/createCampaign.js";


const main = async () => {
  try {
    const result = await createCampaign({
      id: "12122363123122221124423",
      title: CAMPAIGN_TITLE,
      description: CAMPAIGN_DESC,
      category: CAMPAIGN_CATEGORY,
      goal: CAMPAIGN_GOAL,
      deadline: CAMPAIGN_DEADLINE,
      image: CAMPAIGN_IMAGE,
      createdAt: CAMPAIGN_CREATED_AT,
    });
    
    // consoling result
    console.log(
      `✅ Transaction has been submitted: `,result
    );


  } catch (error) {
    console.error(`❌ Failed to submit transaction: `,error);

  } finally {
    await disconnectFromGateway();
    process.exit(0);
  }
};



main();
  