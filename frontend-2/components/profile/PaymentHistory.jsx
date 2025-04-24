'use client';

import { useEffect, useState } from "react";
import { useTokenService } from "@/hooks/use-token-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function PaymentHistory() {
  const { getPayments } = useTokenService();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const userPayments = await getPayments();
        setPayments(userPayments);
      } catch (error) {
        toast.error("Failed to fetch payment history", {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment History</h2>
      <Card>
        <CardContent>
          <div className="rounded-md">
            <div className="p-4 grid grid-cols-4 font-medium">
              <div>Date</div>
              <div>Campaign</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            <Separator />
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <div key={payment.id || index}>
                  <div className="p-4 grid grid-cols-4">
                    <div>{new Date(payment.date).toLocaleDateString()}</div>
                    <div>{payment.campaign}</div>
                    <div>{payment.amount} {payment.currency}</div>
                    <div className={`${
                      payment.status.toLowerCase() === 'completed' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {payment.status}
                    </div>
                  </div>
                  {index < payments.length - 1 && <Separator />}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No payment history available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 