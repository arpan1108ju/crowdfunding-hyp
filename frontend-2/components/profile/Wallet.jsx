'use client';

import { useEffect, useState } from "react";
import { CreditCard, RefreshCw } from "lucide-react";
import { useTokenService } from "@/hooks/use-token-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { dispatchBalanceUpdated } from "@/lib/events";

export function Wallet() {
  const { 
    getBalance, 
    getTokenMetadata, 
    getAllExchangeRates,
    mintToken 
  } = useTokenService();

  const [balance, setBalance] = useState(0);
  const [metadata, setMetadata] = useState(null);
  const [rates, setRates] = useState([]);
  const [mintAmount, setMintAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBalance = async () => {
    try {
      const response = await getBalance();
      if(!response.success){
        throw new Error(response.message);
      }
      setBalance(response.data.balance);   
    } catch (error) {
      toast.error("Failed to fetch balance", {
        description: error.message
      });
    }
  }

  const fetchTokenMetadata = async () => {
    try {
      const response = await getTokenMetadata();  
      if(!response.success){
        throw new Error(response.message);
      }
      setMetadata(response.data.tokenMetadata);
    } catch (error) {
      toast.error("Failed to fetch token metadata", {
        description: error.message
      });
    }
  }

  const fetchExchangeRates = async () => {
    try {
      const response = await getAllExchangeRates();
      if(!response.success){
        throw new Error(response.message);
      }
      setRates(response.data.exchangeRates);
    } catch (error) {
      toast.error("Failed to fetch exchange rates", {
        description: error.message
      });
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchBalance(),
        fetchTokenMetadata(),
        fetchExchangeRates()
      ]);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMintToken = async () => {
    if (!mintAmount || mintAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const response = await mintToken(selectedCurrency, mintAmount);
      if(!response.success){
        throw new Error(response.message);
      }
      await fetchBalance();
      dispatchBalanceUpdated();
      toast.success("Tokens minted successfully");
      setMintAmount(0);
    } catch (error) {
      toast.error("Failed to mint tokens", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getExpectedTokens = () => {
    if (!mintAmount || mintAmount <= 0) return 0;
    const rate = rates.find(r => r.currency === selectedCurrency)?.rateToToken || 0;
    return (mintAmount * rate).toFixed(2);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            <CardTitle>Wallet</CardTitle>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>Your current balance and token information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold">{balance} {metadata?.symbol}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Token Metadata</p>
            <p>{metadata?.name}  <Badge variant="outline" className="text-sm mx-2 mt-2 pb-1 bg-muted">{metadata?.symbol}</Badge></p>
            <p className="text-sm text-muted-foreground">Total Supply: {metadata?.totalSupply}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Conversion Rates</p>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left text-sm font-medium">Currency</th>
                  <th className="p-2 text-left text-sm font-medium">Rate to {metadata?.symbol}</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr key={rate.currency} className="border-b last:border-0">
                    <td className="p-2">{rate.currency}</td>
                    <td className="p-2">1 {rate.currency} = {rate.rateToToken} {metadata?.symbol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Mint Tokens</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Select
                  value={selectedCurrency}
                  onValueChange={setSelectedCurrency}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {rates.map((rate) => (
                      <SelectItem key={rate.currency} value={rate.currency}>
                        {rate.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(Number(e.target.value))}
                  className="flex-1"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                    <Button 
                      onClick={handleMintToken}
                      disabled={isLoading || mintAmount <= 0 || selectedCurrency === ""}
                    >
                      {isLoading ? "Minting..." : "Mint"}
                    </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isLoading ? "Processing your mint request..." : 
                     mintAmount <= 0 ? "Please enter a valid amount" :
                     selectedCurrency === "" ? "Please select a currency" :
                     "Click to mint tokens"}
                  </TooltipContent>
                </Tooltip>
              </div>
              {mintAmount > 0 && (
                <p className="text-sm text-muted-foreground">
                  You will receive approximately {getExpectedTokens()} {metadata?.symbol}
                </p>
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
} 