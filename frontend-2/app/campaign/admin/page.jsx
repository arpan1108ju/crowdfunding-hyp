"use client"

import { CampaignList } from "@/components/campaign-list";
import React from "react";

function AdminCampaigns() {
    return (
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold mb-6">Campaigns created by you</h1>
          <CampaignList isAdminCampaigns={true} />
        </div>
    );
}

export default AdminCampaigns;
