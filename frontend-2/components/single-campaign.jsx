'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Calendar, Clock, ArrowLeft, Edit, Trash, Ban, CreditCard } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useAuth } from "@/hooks/use-auth";
import { useTokenService } from "@/hooks/use-token-service";
import { CAMPAIGN_ACTION, ROLE } from "@/lib/constants";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useCampaignService } from "@/hooks/use-campaign-service";


export function SingleCampaign({ campaign }) {
  const router = useRouter();
  const { session } = useAuth();
  const { getTokenMetadata , getBalance } = useTokenService();

  const { donateToCampaign,withdrawFromCampaign,cancelCampaign,deleteCampaign } = useCampaignService();

  const [isLoading, setIsLoading] = useState(false);
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [balance, setBalance] = useState(null);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: null, // 'donate', 'withdraw', 'cancel', 'delete'
    data: null
  });

  const isAdmin = session?.role === ROLE.ADMIN || session?.role === ROLE.SUPERADMIN;
  // const isOwner = session?.id === campaign.owner;
  const isOwner = isAdmin;
  const canWithdraw = isOwner && !campaign.withdrawn && !campaign.canceled;
  const canCancel = isOwner && !campaign.withdrawn && !campaign.canceled;
  const canDonate = !campaign.withdrawn && !campaign.canceled && Date.now() < campaign.deadline;

  const fetchTokenMetadata = async () => {
    try {
      const response = await getTokenMetadata();
      if (!response.success) {
        throw new Error(response.message);
      }
      setTokenMetadata(response.data.tokenMetadata);
    } catch (error) {
      toast.error("Error", {
        description: error.message
      });
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await getBalance();
      if (!response.success) {
        throw new Error(response.message);
      }
      setBalance(response.data.balance);
    } catch (error) {
      toast.error("Error fetching balance", {
        description: error.message
      });
    }
  };

  useEffect(() => {
    console.log('id : ',campaign.id);
    fetchTokenMetadata();
  }, []);

  const getCampaignStatus = () => {
    const now = Date.now();
    if (campaign.canceled) {
      return { label: "Canceled", variant: "destructive" };
    }
    if (campaign.withdrawn) {
      return { label: "Withdrawn", variant: "secondary" };
    }
    if (now > campaign.deadline) {
      return { label: "Completed", variant: "default" };
    }
    return { label: "Ongoing", variant: "success" };
  };

  const getTimeRemaining = () => {
    const now = Date.now();
    const timeLeft = campaign.deadline - now;

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

  const handleAction = async (type) => {
    if (type === CAMPAIGN_ACTION.DONATE) {
      await fetchBalance();
    }
    setDialogState({ isOpen: true, type, data: null });
  };

  const handleConfirmAction = async () => {
    setIsLoading(true);
    try {
      let response;
      switch (dialogState.type) {
        case CAMPAIGN_ACTION.DONATE:
          if (!donationAmount || donationAmount <= 0) {
            throw new Error('Please enter a valid donation amount');
          }
          response = await donateToCampaign(campaign.id, donationAmount);
          if (!response.success) {
            throw new Error(response.message);
          }
          toast.success('Donation successful');
          break;

        case CAMPAIGN_ACTION.WITHDRAW:
          response = await withdrawFromCampaign(campaign.id);
          if (!response.success) {
            throw new Error(response.message);
          }
          toast.success('Funds withdrawn successfully');
          break;

        case CAMPAIGN_ACTION.CANCEL:
          response = await cancelCampaign(campaign.id);
          if (!response.success) {
            throw new Error(response.message);
          }
          toast.success('Campaign canceled successfully');
          break;

        case CAMPAIGN_ACTION.DELETE:
          response = await deleteCampaign(campaign.id);
          if (!response.success) {
            throw new Error(response.message);
          }
          toast.success('Campaign deleted successfully');
          break;
      }
      router.refresh();
    } catch (error) {
      toast.error(`Failed to ${dialogState.type.toLowerCase()} campaign`, {
        description: error.message
      });
    } finally {
      setIsLoading(false);
      setDialogState({ isOpen: false, type: null, data: null });
      setDonationAmount(0);
    }
  };

  if (!campaign) {
    return <div>Campaign not found.</div>;
  }

  const status = getCampaignStatus();

  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to campaigns
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image and Donors */}
        <div className="space-y-6">
          <div className="relative">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full aspect-video object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4">
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Donors</h3>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {campaign.donators?.length > 0 ? (
                <div className="space-y-4">
                  {campaign.donators.map((donor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{donor.name}</span>
                      <span>{donor.amount} {tokenMetadata?.symbol}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No donors yet</p>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Right Column - Campaign Details */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <span className="text-muted-foreground px-2 py-1">
                Category : <Badge variant="outline" className="text-sm mt-2 pb-1 bg-muted">
                    {campaign.campaignType}
                  </Badge>
              </span>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleAction(CAMPAIGN_ACTION.DELETE)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-lg font-medium">
                {campaign.amountCollected.toLocaleString()} {tokenMetadata?.symbol} raised of {campaign.target.toLocaleString()} {tokenMetadata?.symbol}
              </span>
              <span className="text-lg font-medium">
                {Math.round((campaign.amountCollected / campaign.target) * 100)}%
              </span>
            </div>
            <Progress value={(campaign.amountCollected / campaign.target) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              {campaign.donators?.length || 0} backers
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(campaign.deadline)}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {getTimeRemaining()}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About this campaign</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {campaign.description}
            </p>
          </div>

          <Separator />

          <div className="flex gap-3 flex-col">
            {session ? (
              <>
                {canDonate && (
                  <Button 
                    className="flex-1"
                    onClick={() => handleAction(CAMPAIGN_ACTION.DONATE)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Donate Now
                  </Button>
                )}
                {canWithdraw && (
                  <Button 
                    variant="outline"
                    onClick={() => handleAction(CAMPAIGN_ACTION.WITHDRAW)}
                  >
                    Withdraw Funds
                  </Button>
                )}
                {canCancel && (
                  <Button 
                    variant="destructive"
                    onClick={() => handleAction(CAMPAIGN_ACTION.CANCEL)}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Cancel Campaign
                  </Button>
                )}
              </>
            ) : (
              <Button asChild className="flex-1">
                <a href="/login">Login to Donate</a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogState.isOpen} onOpenChange={(open) => !open && setDialogState({ isOpen: false, type: null, data: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState.type === CAMPAIGN_ACTION.DONATE ? 'Make a Donation' :
               dialogState.type === CAMPAIGN_ACTION.WITHDRAW ? 'Withdraw Funds' :
               dialogState.type === CAMPAIGN_ACTION.CANCEL ? 'Cancel Campaign' :
               'Delete Campaign'}
            </DialogTitle>
            <DialogDescription>
              {dialogState.type === CAMPAIGN_ACTION.DONATE ? 'Enter the amount you want to donate.' :
               dialogState.type === CAMPAIGN_ACTION.WITHDRAW ? 'Are you sure you want to withdraw all funds? This action cannot be undone.' :
               dialogState.type === CAMPAIGN_ACTION.CANCEL ? 'Are you sure you want to cancel this campaign? This will stop all future donations.' :
               'Are you sure you want to delete this campaign? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          {dialogState.type === CAMPAIGN_ACTION.DONATE && (
            <div className="py-4">
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                step="0.01"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Available balance: {balance !== null ? balance : 'Loading...'} {tokenMetadata?.symbol}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogState({ isOpen: false, type: null, data: null })}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant={dialogState.type === CAMPAIGN_ACTION.DELETE || dialogState.type === CAMPAIGN_ACTION.CANCEL ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : 
               dialogState.type === CAMPAIGN_ACTION.DONATE ? 'Donate' :
               dialogState.type === CAMPAIGN_ACTION.WITHDRAW ? 'Withdraw' :
               dialogState.type === CAMPAIGN_ACTION.CANCEL ? 'Cancel Campaign' :
               'Delete Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 