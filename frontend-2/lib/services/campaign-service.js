// "use server"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const EXTENDED_BACKEND_URL= `${backendUrl}/api/v1`;


export async function getCampaigns() {
    try {
      const res = await fetch(`${EXTENDED_BACKEND_URL}/campaigns`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // disables caching for SSR if used in Next.js
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch campaigns");
      }
  
      const data = await res.json();
  
      return data.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        target: campaign.target,
        raised: campaign.raised,
        backers: campaign.backers,
        daysLeft: campaign.daysLeft,
        image: campaign.image,
      }));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  }
  

  export async function getCampaign(id) {
    try {
      const response = await fetch(`${EXTENDED_BACKEND_URL}/campaigns/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // disable caching if needed
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch campaign with ID ${id}`);
      }
  
      const campaign = await response.json();
      return campaign;
    } catch (error) {
      console.error("Error fetching campaign:", error);
      throw new Error("Campaign not found");
    }
  }
  


  export async function createCampaign(campaign) {
    try {
      const response = await fetch(`${EXTENDED_BACKEND_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaign),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create campaign");
      }
  
      const newCampaign = await response.json();
      return newCampaign;
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw new Error("Campaign creation failed");
    }
  }
  
  export async function donateToCampaign(campaignId, amount, userId) {
    try {
      const response = await fetch(`${EXTENDED_BACKEND_URL}/campaigns/${campaignId}/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, userId }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to donate to campaign");
      }
  
      const updatedCampaign = await response.json();
      return updatedCampaign;
    } catch (error) {
      console.error("Error donating to campaign:", error);
      throw new Error("Donation failed");
    }
  }
  