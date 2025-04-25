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
import { ROLE } from "@/lib/constants";
import { toast } from "sonner";

export function SingleCampaign({ campaign }) {
  const router = useRouter();
  const { session } = useAuth();
  const { getMetadata } = useTokenService();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenMetadata, setTokenMetadata] = useState({ symbol: 'TOKEN' });
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: null, // 'donate', 'withdraw', 'cancel', 'delete'
    data: null
  });

  const isAdmin = session?.role === ROLE.ADMIN || session?.role === ROLE.SUPERADMIN;
  const isOwner = session?.id === campaign.owner;
  const canWithdraw = isOwner && !campaign.withdrawn && !campaign.canceled;
  const canCancel = isOwner && !campaign.withdrawn && !campaign.canceled;
  const canDonate = !campaign.withdrawn && !campaign.canceled && Date.now() < campaign.deadline;

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      try {
        const response = await getMetadata();
        if (response.success) {
          setTokenMetadata(response.data.metadata);
        }
      } catch (error) {
        console.error('Failed to fetch token metadata:', error);
      }
    };
    fetchTokenMetadata();
  }, [getMetadata]);

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
    setDialogState({ isOpen: true, type, data: null });
  };

  const handleConfirmAction = async () => {
    setIsLoading(true);
    try {
      let message;
      switch (dialogState.type) {
        case 'donate':
          // Handle donation
          message = "Donation successful";
          break;
        case 'withdraw':
          // Handle withdrawal
          message = "Funds withdrawn successfully";
          break;
        case 'cancel':
          // Handle cancellation
          message = "Campaign canceled successfully";
          break;
        case 'delete':
          // Handle deletion
          message = "Campaign deleted successfully";
          break;
      }
      toast.success(message);
      router.refresh();
    } catch (error) {
      toast.error(`Failed to ${dialogState.type} campaign`, {
        description: error.message
      });
    } finally {
      setIsLoading(false);
      setDialogState({ isOpen: false, type: null, data: null });
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
              src={campaign.image || "/placeholder.svg"}
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
                      <span>{donor.amount} {tokenMetadata.symbol}</span>
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
              <p className="text-muted-foreground">Campaign Type: {campaign.type}</p>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleAction('delete')}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-lg font-medium">
                {campaign.amountCollected.toLocaleString()} {tokenMetadata.symbol} raised of {campaign.target.toLocaleString()} {tokenMetadata.symbol}
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

          <div className="flex gap-3">
            {session ? (
              <>
                {canDonate && (
                  <Button 
                    className="flex-1"
                    onClick={() => handleAction('donate')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Donate Now
                  </Button>
                )}
                {canWithdraw && (
                  <Button 
                    variant="outline"
                    onClick={() => handleAction('withdraw')}
                  >
                    Withdraw Funds
                  </Button>
                )}
                {canCancel && (
                  <Button 
                    variant="destructive"
                    onClick={() => handleAction('cancel')}
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
              {dialogState.type === 'donate' ? 'Make a Donation' :
               dialogState.type === 'withdraw' ? 'Withdraw Funds' :
               dialogState.type === 'cancel' ? 'Cancel Campaign' :
               'Delete Campaign'}
            </DialogTitle>
            <DialogDescription>
              {dialogState.type === 'donate' ? 'Enter the amount you want to donate.' :
               dialogState.type === 'withdraw' ? 'Are you sure you want to withdraw all funds? This action cannot be undone.' :
               dialogState.type === 'cancel' ? 'Are you sure you want to cancel this campaign? This will stop all future donations.' :
               'Are you sure you want to delete this campaign? This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogState({ isOpen: false, type: null, data: null })}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant={dialogState.type === 'delete' || dialogState.type === 'cancel' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : 
               dialogState.type === 'donate' ? 'Donate' :
               dialogState.type === 'withdraw' ? 'Withdraw' :
               dialogState.type === 'cancel' ? 'Cancel Campaign' :
               'Delete Campaign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 