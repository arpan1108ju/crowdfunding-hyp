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


import {toast} from "sonner";

export function CampaignList({isAdminCampaigns = false}) {
  const { getAllCampaigns , getUserCampaigns } = useCampaignService();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const getCampaignStatus = (campaign) => {
    const now = Date.now();
    const deadline = campaign.deadline;

    if (campaign.canceled) {
      return { label: "Canceled", variant: "destructive" };
    }
    if (campaign.withdrawn) {
      return { label: "Withdrawn", variant: "secondary" };
    }
    if (now > deadline) {
      return { label: "Completed", variant: "default" };
    }
    return { label: "Ongoing", variant: "success" };
  };

  const getTimeRemaining = (deadline) => {
    const now = Date.now();
    const timeLeft = deadline - now;

    if (timeLeft <= 0) return "Ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h left`;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  async function loadCampaigns() {
    try {
      let result;
      if(isAdminCampaigns){
        result = await getUserCampaigns();
      }else{
        result = await getAllCampaigns();
      }
      
      if(!result.success){
        throw new Error(result.message);
      }

      console.log('result : ',result.data);
      setCampaigns(result.data);
    } catch (error) {
      toast.error("Error", {
        description : error.message
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCampaigns();
  };

  useEffect(() => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Campaigns</h2>
        <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
            onClick={() => router.push(`/campaign/${campaign.id}`)}
          >
            <div className="relative h-48 w-full">
              <img
                src={campaign.image }
                alt={campaign.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={getCampaignStatus(campaign).variant}>
                  {getCampaignStatus(campaign).label}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    ${campaign.amountCollected.toLocaleString()} raised of ${campaign.target.toLocaleString()}
                  </span>
                  <span>{Math.round((campaign.amountCollected / campaign.target) * 100)}%</span>
                </div>
                <Progress value={(campaign.amountCollected / campaign.target) * 100} />
              </div>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(campaign.deadline)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {getTimeRemaining(campaign.deadline)}
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {campaign?.numDonors || 0} donors
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}