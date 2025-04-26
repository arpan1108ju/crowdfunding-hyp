"use server"

import { CAMPAIGNS_DB } from "../data/dummy-data";
import { Campaign } from "../types/types";


export async function getCampaigns() {
  // In a real app, you would fetch from the database
  return CAMPAIGNS_DB.map((campaign) => ({
    id: campaign.id,
    title: campaign.title,
    description: campaign.description,
    target: campaign.target,
    raised: campaign.raised,
    backers: campaign.backers,
    daysLeft: campaign.daysLeft,
    image: campaign.image,
  }))
}

export async function getCampaign(id: string) {
  try {
    const response = await fetch(`/api/v1/campaigns/${id}`,{
      credentials : 'include',
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


export async function createCampaign(campaign: Campaign) {
  try {
    const response = await fetch('/api/v1/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaign),
      credentials : 'include',    
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


export async function donateToCampaign(campaignId: string, amount: number, userId: string) {
  try {
    const response = await fetch(`/api/v1/campaigns/${campaignId}/donate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, userId }),
      credentials : 'include',
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

