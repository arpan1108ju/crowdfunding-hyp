import React from "react";
import { CampaignList } from "@/components/campaign-list";

function Campaigns() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">All Campaigns</h1>
      <CampaignList />
    </div>
  );
}

export default Campaigns;
