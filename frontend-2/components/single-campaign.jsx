'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Calendar, Clock, ArrowLeft, Edit, Trash, Ban, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

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
import { dispatchBalanceUpdated } from "@/lib/events";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { campaignTypes } from "@/lib/data/dummy-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export function SingleCampaign({ campaign, onCampaignUpdate }) {
  const router = useRouter();
  const { session } = useAuth();
  const { getTokenMetadata , getBalance } = useTokenService();

  const { donateToCampaign,withdrawFromCampaign,cancelCampaign,deleteCampaign, updateCampaign } = useCampaignService();

  const [isLoading, setIsLoading] = useState(false);
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [balance, setBalance] = useState(null);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    type: null, // 'donate', 'withdraw', 'cancel', 'delete'
    data: null
  });
  const [editDialogState, setEditDialogState] = useState({
    isOpen: false,
    data: null
  });

  const isAdmin = session?.role === ROLE.ADMIN;
  const isSuperAdmin = session?.role === ROLE.SUPER_ADMIN;
  const isVerifiedUser = session?.role === ROLE.VERIFIED_USER;
  const isOwner = session?.id === campaign?.owner?.id;
  const canWithdraw = (isOwner || isAdmin) && !campaign?.withdrawn && !campaign?.canceled;
  const canCancel = (isOwner || isAdmin) && !campaign?.withdrawn && !campaign?.canceled;
  const canDonate = (isAdmin || isVerifiedUser) && !campaign?.withdrawn && !campaign?.canceled && Date.now() < campaign?.deadline;

  // const isAdmin = false;
  // const isSuperAdmin = false;
  // const isVerifiedUser = true;
  // const isOwner = false;
  // const canWithdraw = false;
  // const canCancel = false;
  // const canDonate = false;




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
    console.log('camp : ',campaign);
    fetchTokenMetadata();
  }, []);

  const getCampaignStatus = () => {
    const now = Date.now();
    if (campaign?.canceled) {
      return { label: "Canceled", variant: "destructive" };
    }
    if (campaign?.withdrawn) {
      return { label: "Withdrawn", variant: "secondary" };
    }
    if (now > campaign?.deadline) {
      return { label: "Completed", variant: "default" };
    }
    return { label: "Ongoing", variant: "success" };
  };

  const getTimeRemaining = () => {
    const now = Date.now();
    const timeLeft = campaign?.deadline - now;

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
          
          if (balance < donationAmount) {
            throw new Error(`Insufficient balance. You have ${balance} ${tokenMetadata?.symbol} available.`);
          }
          
          response = await donateToCampaign(campaign.id, donationAmount);
          if (!response.success) {
            throw new Error(response.message);
          }
          dispatchBalanceUpdated();
          toast.success('Donation successful');
          await onCampaignUpdate();
          break;

        case CAMPAIGN_ACTION.WITHDRAW:
          response = await withdrawFromCampaign(campaign.id);
          if (!response.success) {
            throw new Error(response.message);
          }
          dispatchBalanceUpdated();
          toast.success('Funds withdrawn successfully');
          await onCampaignUpdate();
          break;

        case CAMPAIGN_ACTION.CANCEL:
          response = await cancelCampaign(campaign.id);
          if (!response.success) {
            throw new Error(response.message);
          }
          dispatchBalanceUpdated();
          toast.success('Campaign canceled successfully');
          await onCampaignUpdate();
          break;

        case CAMPAIGN_ACTION.DELETE:
          response = await deleteCampaign(campaign.id);
          if (!response.success) {
            throw new Error(response.message);
          }
          toast.success('Campaign deleted successfully');
          router.push('/campaign');
          break;
      }
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

  const handleEdit = () => {
    if (!campaign) return;
    
    setEditDialogState({
      isOpen: true,
      data: {
        title: campaign?.title || '',
        description: campaign?.description || '',
        campaignType: campaignTypes.includes(campaign?.campaignType) ? campaign?.campaignType : 'Other',
        customType: campaignTypes.includes(campaign?.campaignType) ? '' : campaign?.campaignType,
        goal: campaign?.target || 0,
        deadline: campaign?.deadline || Date.now(),
        image: campaign?.image || ''
      }
    });
  };

  const handleSelectChange = (value) => {
    setEditDialogState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        campaignType: value,
        customType: value === 'Other' ? prev.data.customType : ''
      }
    }));
  };

  const handleUpdateCampaign = async () => {
    if (!campaign?.id || !editDialogState.data) return;
    
    setIsLoading(true);
    try {
      const campaignData = {
        ...editDialogState.data,
        campaignType: editDialogState.data.campaignType === 'Other' ? editDialogState.data.customType : editDialogState.data.campaignType
      };
      const response = await updateCampaign(campaign.id, campaignData);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success('Campaign updated successfully');
      setEditDialogState({ isOpen: false, data: null });
      await onCampaignUpdate();
    } catch (error) {
      toast.error('Failed to update campaign', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
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

      {/* Main Campaign Container */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Left Column - Campaign Image */}
            <div className="h-full">
              <div className="relative w-full h-full">
                <img
                  src={campaign?.image}
                  alt={campaign?.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </div>
            </div>

            {/* Right Column - Campaign Details */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{campaign?.title}</h1>
                  <span className="text-muted-foreground px-2 py-1">
                    Category : <Badge variant="outline" className="text-sm mt-2 pb-1 bg-muted">
                      {campaign?.campaignType}
                    </Badge>
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleEdit}>
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
                    {campaign?.amountCollected.toLocaleString()} {tokenMetadata?.symbol} raised of {campaign?.target.toLocaleString()} {tokenMetadata?.symbol}
                  </span>
                  <span className="text-lg font-medium">
                    {Math.round((campaign?.amountCollected / campaign?.target) * 100)}%
                  </span>
                </div>
                <Progress value={(campaign?.amountCollected / campaign?.target) * 100} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {campaign?.donators?.length || 0} backers
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(campaign?.deadline)}
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
                  {campaign?.description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      {/* </Card> */}

      {/* Donors Table and Action Buttons Container */}
      {/* <Card> */}
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Donors Table - 70% width */}
            <div className="w-full md:w-[70%]">
              <h2 className="text-xl font-semibold mb-4">Donors</h2>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Donor</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {campaign?.donors?.length > 0 ? (
                      campaign.donors.map((donor, index) => (
                        <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">{donor.donor}</td>
                          <td className="p-4 align-middle">{donor.donation} {tokenMetadata?.symbol}</td>
                          <td className="p-4 align-middle">{formatDate(donor.timestamp)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="p-4 text-center text-muted-foreground">No donors yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons - 30% width */}
            {session && (
              <div className="w-full md:w-[30%] flex items-center">
                <div className="w-full grid auto-cols-fr gap-3" style={{
                  gridTemplateColumns: '1fr',
                  gridAutoRows: 'min-content'
                }}>
                  {/* Donate button for admin and verified users */}
                  {canDonate && (
                    <Button 
                      className="w-full"
                      onClick={() => handleAction(CAMPAIGN_ACTION.DONATE)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Donate Now
                    </Button>
                  )}
                  
                  {/* Withdraw button with updated styling */}
                  {canWithdraw && (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleAction(CAMPAIGN_ACTION.WITHDRAW)}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Withdraw Funds
                    </Button>
                  )}

                  {/* Cancel button */}
                  {canCancel && (
                    <Button 
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleAction(CAMPAIGN_ACTION.CANCEL)}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Cancel Campaign
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
              {dialogState.type === CAMPAIGN_ACTION.DONATE ? (
                balance < donationAmount ? (
                  <p className="text-red-500">
                    Insufficient balance. You have {balance} {tokenMetadata?.symbol} available.
                  </p>
                ) : donationAmount > (campaign?.target - campaign?.amountCollected) ? (
                  <p className="text-red-500">
                    Donation amount exceeds remaining target. Remaining amount: {campaign?.target - campaign?.amountCollected} {tokenMetadata?.symbol}
                  </p>
                ) : (
                  'Enter the amount you want to donate.'
                )
              ) : dialogState.type === CAMPAIGN_ACTION.WITHDRAW ? 'Are you sure you want to withdraw all funds? This action cannot be undone.' :
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
              <p className="text-sm text-muted-foreground mt-1">
                Remaining target: {campaign?.target - campaign?.amountCollected} {tokenMetadata?.symbol}
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
              disabled={isLoading || 
                (dialogState.type === CAMPAIGN_ACTION.DONATE && 
                  (balance < donationAmount || donationAmount > (campaign?.target - campaign?.amountCollected)))}
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

      {/* Edit Campaign Dialog */}
      <Dialog 
        open={editDialogState.isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setEditDialogState({ isOpen: false, data: null });
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update your campaign details below.
            </DialogDescription>
          </DialogHeader>
          {editDialogState.data && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editDialogState.data.title}
                  onChange={(e) => setEditDialogState(prev => ({
                    ...prev,
                    data: { ...prev.data, title: e.target.value }
                  }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editDialogState.data.description}
                  onChange={(e) => setEditDialogState(prev => ({
                    ...prev,
                    data: { ...prev.data, description: e.target.value }
                  }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="campaignType">Campaign Type</Label>
                <Select value={editDialogState.data.campaignType} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editDialogState.data.campaignType === 'Other' && (
                  <Input
                    id="customType"
                    value={editDialogState.data.customType}
                    onChange={(e) => setEditDialogState(prev => ({
                      ...prev,
                      data: { ...prev.data, customType: e.target.value }
                    }))}
                    placeholder="Specify campaign type"
                    className="mt-2"
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goal">Goal Amount</Label>
                <Input
                  id="goal"
                  type="number"
                  value={editDialogState.data.goal}
                  onChange={(e) => setEditDialogState(prev => ({
                    ...prev,
                    data: { ...prev.data, goal: Number(e.target.value) }
                  }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      id="deadline-date"
                      type="date"
                      value={new Date(editDialogState.data.deadline).toISOString().split('T')[0]}
                      onChange={(e) => {
                        const time = new Date(editDialogState.data.deadline).toISOString().split('T')[1].slice(0, 5);
                        setEditDialogState(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            deadline: new Date(`${e.target.value}T${time}`).getTime()
                          }
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      id="deadline-time"
                      type="time"
                      value={new Date(editDialogState.data.deadline).toISOString().split('T')[1].slice(0, 5)}
                      onChange={(e) => {
                        const date = new Date(editDialogState.data.deadline).toISOString().split('T')[0];
                        setEditDialogState(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            deadline: new Date(`${date}T${e.target.value}`).getTime()
                          }
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={editDialogState.data.image}
                  onChange={(e) => setEditDialogState(prev => ({
                    ...prev,
                    data: { ...prev.data, image: e.target.value }
                  }))}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogState({ isOpen: false, data: null })}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCampaign}
              disabled={isLoading || !editDialogState.data || (editDialogState.data.campaignType === 'Other' && !editDialogState.data.customType)}
            >
              {isLoading ? "Updating..." : "Update Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 