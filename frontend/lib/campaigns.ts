"use server"

// This would be replaced with actual database queries


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

export async function createCampaign(data: {
  title: string
  description: string
  target: number
  image: string
  userId: string
}) {
  // In a real app, you would store in the database
  const newCampaign = {
    id: (CAMPAIGNS_DB.length + 1).toString(),
    title: data.title,
    description: data.description,
    target: data.target,
    raised: 0,
    backers: 0,
    daysLeft: 30,
    image: data.image,
    createdBy: data.userId,
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
