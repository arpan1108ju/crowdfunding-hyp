import { useEffect, useState, useCallback } from "react";
import { useUserService } from "@/hooks/use-user-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function TokenMintHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { getAllUserPayments } = useUserService();

  const fetchPayments = useCallback(async () => {
    try {
      const response = await getAllUserPayments();
      if (!response.success) {
        throw new Error(response.message);
      }
      setPayments(response.data);
      if (isRefreshing) {
        toast.success("Token mint history refreshed successfully");
      }
    } catch (error) {
      toast.error("Failed to fetch token mint history", {
        description: error.message
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [getAllUserPayments, isRefreshing]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    const handleTokenMintHistoryRefresh = () => {
      console.log('Token mint history refresh event received');
      handleRefresh();
    };

    window.addEventListener('tokenMintHistoryRefresh', handleTokenMintHistoryRefresh);

    return () => {
      window.removeEventListener('tokenMintHistoryRefresh', handleTokenMintHistoryRefresh);
    };
  }, [handleRefresh]);

  if (loading || isRefreshing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Token Mint History</h2>
          <Button
            variant="outline"
            size="icon"
            disabled={true}
          >
            <RefreshCw className="h-4 w-4 animate-spin" />
          </Button>
        </div>
        <Card>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Token Mint History</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Tokens Minted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No payment history found
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(new Date(payment.createdAt), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{payment.amountPaid}</TableCell>
                    <TableCell>{payment.currency}</TableCell>
                    <TableCell>{payment.tokenMinted}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status.toLowerCase() === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'failure' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status.toUpperCase()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 