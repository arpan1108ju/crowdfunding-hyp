"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useCampaignService } from "@/hooks/use-campaign-service";

export function CampaignList() {
  const { getAllCampaigns } = useCampaignService();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const result = await getAllCampaigns();
        console.log("Fetched campaigns:", result.data);

        if (Array.isArray(result.data)) {
          setCampaigns(result.data);
        } else {
          console.error("Campaign data is not an array:", result);
          setCampaigns([]);
        }
      } catch (error) {
        console.error("Failed to load campaigns:", error);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-muted animate-pulse" />
            <CardHeader>
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-muted animate-pulse rounded mb-4" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </CardContent>
            <CardFooter>
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return <p className="text-muted-foreground text-center w-full">No campaigns found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => {
        const percentRaised = Math.round((campaign.amountCollected / campaign.target) * 100);
        const daysLeft = Math.max(0, Math.ceil((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24)));

        return (
          <Card key={campaign.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <img
                src={campaign.image || "/placeholder.svg"}
                alt={campaign.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{campaign.title}</CardTitle>
              <CardDescription>{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    ${campaign.amountCollected.toLocaleString()} raised of ${campaign.target.toLocaleString()}
                  </span>
                  <span>{percentRaised}%</span>
                </div>
                <Progress value={percentRaised} />
              </div>
              <div className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  {campaign.donators?.length || 0} backers
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {daysLeft} days left
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/campaign/${campaign.id}`}>View Campaign</Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
