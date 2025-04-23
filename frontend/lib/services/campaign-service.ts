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
  // In a real app, you would fetch from the database
  const campaign = CAMPAIGNS_DB.find((c) => c.id === id)

  if (!campaign) {
    throw new Error("Campaign not found")
  }

  return campaign
}

export async function createCampaign(campaign: Campaign) {
  // In a real app, you would store in the database
  const newCampaign = {
    id: (CAMPAIGNS_DB.length + 1).toString(),
    title: campaign.title,
    description: campaign.description,
    target: campaign.target,
    raised: 0,
    backers: 0,
    daysLeft: 30,
    image: campaign.image
  }
  CAMPAIGNS_DB.push(newCampaign)
  return newCampaign
}

export async function donateToCampaign(campaignId: string, amount: number, userId: string) {
  // In a real app, you would update the database
  const campaign = CAMPAIGNS_DB.find((c) => c.id === campaignId)

  if (!campaign) {
    throw new Error("Campaign not found")
  }

  campaign.raised += amount
  campaign.backers += 1

  return campaign
}
