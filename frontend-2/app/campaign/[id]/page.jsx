"use client"

import { useEffect, useState } from "react"
import { SingleCampaign } from "@/components/single-campaign"
import { useCampaignService } from "@/hooks/use-campaign-service";
import { Skeleton } from "@/components/ui/skeleton";
import { initialCampaigns } from "@/lib/data/dummy-data";

export default function CampaignPage({ params }) {
  const { getCampaignById } = useCampaignService();
  // const [campaign, setCampaign] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaign = async () => {
    try {
      // const result = await getCampaignById(params.id);
      let result = {success: true, data: initialCampaigns[0]}
      if (!result.success) {
        throw new Error(result.message);
      }
      setCampaign(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCampaign();
  }, [params.id, getCampaignById]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-24" />
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-6 text-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return <SingleCampaign campaign={campaign} />;
}
