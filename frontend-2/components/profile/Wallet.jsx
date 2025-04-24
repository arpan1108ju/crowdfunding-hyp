'use client';

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { useTokenService } from "@/hooks/use-token-service";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ROLE } from "@/lib/constants";

export function Wallet() {
  const { session } = useAuth();
  const { 
    getBalance, 
    getTokenMetadata, 
    getExchangeRate, 
    setTokenMetadata, 
    setExchangeRate,
    getAllExchangeRates,
    mintToken 
  } = useTokenService();

  const [balance, setBalance] = useState(0);
  const [metadata, setMetadata] = useState({ symbol: '', name: '' });
  const [rates, setRates] = useState({ usdToCpt: 0, cptToUsd: 0 });
  const [mintAmount, setMintAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = session?.role === ROLE.ADMIN || session?.role === ROLE.SUPERADMIN;

  const fetchBalance = async () => {

    try {
      const response = await getBalance();
      if(!response.success){
        throw new Error(response.message);
      }
      setBalance(response.data);   
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
      setMetadata(response.data);
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
      setRates(response.data);
    } catch (error) {
      toast.error("Failed to fetch exchange rates", {
        description: error.message
      });
    }
  }

  const handleMintToken = async () => {
    if (!mintAmount || isNaN(mintAmount) || parseFloat(mintAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const response = await mintToken(parseFloat(mintAmount));
      if(!response.success){
        throw new Error(response.message);
      }
      const newBalance = await getBalance();
      setBalance(newBalance);
      toast.success("Tokens minted successfully");
      setMintAmount('');
    } catch (error) {
      toast.error("Failed to mint tokens", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTokenMetadata();
    fetchExchangeRates();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Wallet
        </CardTitle>
        <CardDescription>Your current balance and token information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold">{balance} {metadata.symbol}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Token Metadata</p>
          <p>{metadata.name} ({metadata.symbol})</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Conversion Rates</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="rounded-md border p-2">
              <p className="text-xs text-muted-foreground">USD to {metadata.symbol}</p>
              <p className="font-medium">1 USD = {rates.usdToCpt} {metadata.symbol}</p>
            </div>
            <div className="rounded-md border p-2">
              <p className="text-xs text-muted-foreground">{metadata.symbol} to USD</p>
              <p className="font-medium">{rates.cptToUsd} {metadata.symbol} = 1 USD</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Mint Tokens</p>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
              />
              <Button 
                onClick={handleMintToken}
                disabled={isLoading}
              >
                {isLoading ? "Minting..." : "Mint"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 