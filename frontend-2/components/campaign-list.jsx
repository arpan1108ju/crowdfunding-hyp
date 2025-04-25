"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Calendar, RefreshCw, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { useCampaignService } from "@/hooks/use-campaign-service";
import { initialCampaigns } from "@/lib/data/dummy-data";

import {toast} from "sonner";

export function CampaignList() {
  const { getAllCampaigns } = useCampaignService();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  // const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const result = await getAllCampaigns(); // use directly here
        console.log("Fetched campaigns:", result.data);
  
        if (Array.isArray(result.data)) {
          setCampaigns(result.data);
        } else {
          console.error("Campaign data is not an array:", result);
          setCampaigns([]);
        }
      } catch (error) {
        console.error("Failed to load campaigns:", result.message);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
  
    loadCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <p className="text-muted-foreground text-center">No campaigns found.</p>
        <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => (
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
                  ${campaign.raised.toLocaleString()} raised of ${campaign.target.toLocaleString()}
                </span>
                <span>{Math.round((campaign.raised / campaign.target) * 100)}%</span>
              </div>
              <Progress value={(campaign.raised / campaign.target) * 100} />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                {campaign.backers} backers
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                {campaign.daysLeft} days left
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/campaigns/${campaign.id}`}>View Campaign</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
