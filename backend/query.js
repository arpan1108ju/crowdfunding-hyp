// backend/query.js


import { disconnectFromGateway } from "./gateway/disconnect.js";
import { getAllCampaigns } from "./methods/query/getAllCampaigns.js";
import { getCampaign } from "./methods/query/getCampaign.js";

async function query() {
    try {
        const result = await getAllCampaigns();
        console.log('✅ Query Result:', result);
        
    } catch (error) {
        console.error(`❌ Failed to get transaction: `,error);   
    }
    finally {
        await disconnectFromGateway();
        process.exit(0);
    }
}

query();