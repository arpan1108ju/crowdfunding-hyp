import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserService } from '@/hooks/use-user-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { useTokenService } from '@/hooks/use-token-service';

// Initialize Stripe outside of component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ amount, currency, onSuccess, onError, onClose, onProcessingChange }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { payment } = useUserService();
  const { mintToken } = useTokenService();
  const { theme } = useTheme();

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '20px',
        color: theme === 'dark' ? 'oklch(1 0 0)' : 'oklch(0.145 0 0)',
        '::placeholder': {
          color: theme === 'dark' ? 'oklch(0.703 0 0)' : 'oklch(0.556 0 0)',
        },
        backgroundColor: 'transparent',
        ':-webkit-autofill': {
          color: theme === 'dark' ? 'oklch(0.145 0 0)' : 'oklch(1 0 0)',
        },
      },
      invalid: {
        color: 'oklch(0.704 0.191 22.216)',
        iconColor: 'oklch(0.704 0.191 22.216)',
      },
    },
    hidePostalCode: true,
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    },
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    onProcessingChange(true);
    try {
      // Ensure amount is a valid number
      const numericAmount = Number(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Invalid amount');
      }

      // Create Payment Intent using user service
      const resultPayment = await payment({currency, amountPaid: numericAmount});
      if (!resultPayment.success) {
        throw new Error(resultPayment.message);
      }

      const { clientSecret ,paymentId } = resultPayment.data;
      if (!clientSecret) {
        throw new Error('No client secret received');
      }

      // Confirm Payment on client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        // Mint tokens after successful payment
        const mintResult = await mintToken(currency, numericAmount,paymentId);
        if (!mintResult.success) {
          throw new Error(mintResult.message);
        }

        console.log(mintResult);

        toast.success(`Payment successful! ${mintResult.data.updatedPayment.tokenMinted} tokens have been minted.`);
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: error.message
      });
      onError(error);
    } finally {
      setLoading(false);
      onProcessingChange(false);
    }
  };

  return (
    <Card className="bg-card text-card-foreground border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Card Details</label>
            <div className="p-3 border rounded-md bg-background border-border">
              <CardElement 
                options={CARD_ELEMENT_OPTIONS}
                onChange={handleCardChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Amount to pay:</p>
              <p className="text-lg font-semibold text-foreground">{amount} {currency}</p>
            </div>
            <Button 
              type="submit" 
              disabled={!stripe || loading || !cardComplete}
              className="w-32"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function CheckoutModal({ isOpen, onClose, amount, currency, onSuccess, onError }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Payment Checkout</DialogTitle>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            amount={amount} 
            currency={currency} 
            onSuccess={onSuccess}
            onError={onError}
            onClose={onClose}
            onProcessingChange={setIsProcessing}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
} 