'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTokenService } from "@/hooks/use-token-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PAYMENT_TYPE } from "@/lib/constants";

export function PaymentHistory() {
  const router = useRouter();
  const { getPayments } = useTokenService();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getPaymentTypeStyle = (type) => {
    switch (type) {
      case PAYMENT_TYPE.DONATION:
        return 'bg-green-100 text-green-800';
      case PAYMENT_TYPE.WITHDRAWAL:
        return 'bg-blue-100 text-blue-800';
      case PAYMENT_TYPE.CANCEL:
        return 'bg-red-100 text-red-800';
      case PAYMENT_TYPE.REFUND:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchPayments = async () => {
    try {
      const reuslt = await getPayments();
      if(!reuslt.success){
        throw new Error(reuslt.message);
      }
      setPayments(reuslt.data.paymentDetails);
    } catch (error) {
      toast.error("Failed to fetch payment history", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchPayments();
      toast.success("Payment history refreshed");
    } catch (error) {
      toast.error("Failed to refresh payment history");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRowClick = (campaignId) => {
    router.push(`/campaign/${campaignId}`);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const TableSkeleton = () => (
    <div className="space-y-3">
      <div className="h-8 bg-muted rounded animate-pulse" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-8 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment History</h2>
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
        <CardContent className="p-0">
          {(isLoading || isRefreshing) ? (
            <div className="p-4">
              <TableSkeleton />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <TableRow key={payment.id || index} 
                      className="hover:cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(payment.campaignId)}
                    >
                      <TableCell>{new Date(payment.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.campaignId}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentTypeStyle(payment.paymentType)}`}>
                          {payment.paymentType}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                      No payment history available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 