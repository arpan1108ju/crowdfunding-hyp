'use client';

import { useAuth } from '@/hooks/use-auth';
import * as campaignService from '@/lib/services/campaign-service';

export const useCampaignService = () => {
  const { token } = useAuth();

  return {
    getAllCampaigns: () => campaignService.getAllCampaigns(token),
    getUserCampaigns: () => campaignService.getUserCampaigns(token),
    getCampaignById: (id) => campaignService.getCampaignById(token, id),
    createCampaign: (data) => campaignService.createCampaign(token, data),
    donateToCampaign: (id, amount) => campaignService.donateToCampaign(token, id, amount),
    withdrawFromCampaign: (id) => campaignService.withdrawFromCampaign(token, id),
    cancelCampaign: (id) => campaignService.cancelCampaign(token, id),
    updateCampaign: (id, updates) => campaignService.updateCampaign(token, id, updates),
    deleteCampaign: (id) => campaignService.deleteCampaign(token, id),
  };
};
