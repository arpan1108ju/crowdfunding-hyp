'use client';

import { useState, useEffect } from "react";
import { useTokenService } from "@/hooks/use-token-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { initialExchangeRates, initialTokenMetadata } from "@/lib/data/dummy-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TokenManagement() {
  const { getMetadata, setMetadata, getAllExchangeRates, setExchangeRate } = useTokenService();
  
//   const [metadata, setMetadataState] = useState(null);
  const [metadata, setMetadataState] = useState(initialTokenMetadata);
//   const [rates, setRates] = useState([]);
  const [rates, setRates] = useState(initialExchangeRates);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingMetadata, setIsRefreshingMetadata] = useState(false);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);
  const [newRate, setNewRate] = useState({ currency: '', rate: '' });
  const [updateDialog, setUpdateDialog] = useState({ 
    isOpen: false, 
    type: null, // 'metadata' or 'rate'
    data: null 
  });

  const fetchMetadata = async () => {
    setIsRefreshingMetadata(true);
    try {
      const response = await getMetadata();
      if (!response.success) {
        throw new Error(response.message);
      }
      setMetadataState(response.data.metadata);
      toast.success("Token metadata refreshed");
    } catch (error) {
      toast.error("Failed to fetch token metadata", {
        description: error.message
      });
    } finally {
      setIsRefreshingMetadata(false);
    }
  };

  const fetchExchangeRates = async () => {
    setIsRefreshingRates(true);
    try {
      const response = await getAllExchangeRates();
      if (!response.success) {
        throw new Error(response.message);
      }
      setRates(response.data.exchangeRates);
      toast.success("Exchange rates refreshed");
    } catch (error) {
      toast.error("Failed to fetch exchange rates", {
        description: error.message
      });
    } finally {
      setIsRefreshingRates(false);
    }
  };

  const handleUpdateMetadata = async () => {
    setIsLoading(true);
    try {
      const response = await setMetadata(metadata.name, metadata.symbol);
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success("Token metadata updated successfully");
      await fetchMetadata();
    } catch (error) {
      toast.error("Failed to update token metadata", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
      setUpdateDialog({ isOpen: false, type: null, data: null });
    }
  };

  const handleUpdateRate = async (currency, newRate) => {
    setIsLoading(true);
    try {
      const response = await setExchangeRate(currency, parseFloat(newRate));
      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(`Exchange rate updated for ${currency}`);
      await fetchExchangeRates();
    } catch (error) {
      toast.error("Failed to update exchange rate", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
      setUpdateDialog({ isOpen: false, type: null, data: null });
    }
  };

  const handleAddNewRate = async () => {
    if (!newRate.currency || !newRate.rate) {
      toast.error("Please fill in both currency and rate");
      return;
    }
    
    setUpdateDialog({
      isOpen: true,
      type: 'rate',
      data: { ...newRate, isNew: true }
    });
  };

  useEffect(() => {
    Promise.all([fetchMetadata(), fetchExchangeRates()]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Token Management</h2>
      </div>

      {/* Token Metadata Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Token Metadata</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchMetadata}
            disabled={isRefreshingMetadata}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshingMetadata ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Token Name</label>
              <Input
                value={metadata?.name}
                onChange={(e) => setMetadataState(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter token name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Token Symbol</label>
              <Input
                value={metadata?.symbol}
                onChange={(e) => setMetadataState(prev => ({ ...prev, symbol: e.target.value }))}
                placeholder="Enter token symbol"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Supply</label>
              <Input
                value={metadata?.totalSupply}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          <Button
            onClick={() => setUpdateDialog({
              isOpen: true,
              type: 'metadata',
              data: metadata
            })}
            disabled={isLoading}
          >
            Update Metadata
          </Button>
        </CardContent>
      </Card>

      {/* Exchange Rates Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Exchange Rates</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchExchangeRates}
            disabled={isRefreshingRates}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshingRates ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Currency</th>
                  <th className="p-2 text-left">Rate</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr key={rate.currency} className="border-b last:border-0">
                    <td className="p-2">{rate.currency}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={rate.rateToToken}
                        onChange={(e) => {
                          const newRates = rates.map(r => 
                            r.currency === rate.currency 
                              ? { ...r, rateToToken: e.target.value }
                              : r
                          );
                          setRates(newRates);
                        }}
                        className="w-32"
                      />
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUpdateDialog({
                          isOpen: true,
                          type: 'rate',
                          data: rate
                        })}
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Rate */}
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Input
                value={newRate.currency}
                onChange={(e) => setNewRate(prev => ({ ...prev, currency: e.target.value }))}
                placeholder="e.g., EUR"
                className="w-32"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rate</label>
              <Input
                type="number"
                value={newRate.rate}
                onChange={(e) => setNewRate(prev => ({ ...prev, rate: e.target.value }))}
                placeholder="Enter rate"
                className="w-32"
              />
            </div>
            <Button
              onClick={handleAddNewRate}
              className="flex gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Rate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={updateDialog.isOpen} onOpenChange={(open) => !open && setUpdateDialog({ isOpen: false, type: null, data: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {updateDialog.type === 'metadata' ? 'Update Token Metadata' : 
               updateDialog.data?.isNew ? 'Add New Exchange Rate' : 'Update Exchange Rate'}
            </DialogTitle>
            <DialogDescription>
              {updateDialog.type === 'metadata' 
                ? `Are you sure you want to update the token metadata? This will change the token name to "${updateDialog.data?.name}" and symbol to "${updateDialog.data?.symbol}".`
                : updateDialog.data?.isNew
                ? `Are you sure you want to add a new exchange rate for ${updateDialog.data?.currency.toUpperCase()} with rate ${updateDialog.data?.rate}?`
                : `Are you sure you want to update the exchange rate for ${updateDialog.data?.currency} to ${updateDialog.data?.rateToToken}?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateDialog({ isOpen: false, type: null, data: null })}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (updateDialog.type === 'metadata') {
                  handleUpdateMetadata();
                } else if (updateDialog.data?.isNew) {
                  handleUpdateRate(updateDialog.data.currency.toUpperCase(), updateDialog.data.rate);
                } else {
                  handleUpdateRate(updateDialog.data.currency, updateDialog.data.rateToToken);
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 