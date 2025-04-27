import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUserService } from '@/hooks/use-user-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Initialize Stripe outside of component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: 'var(--foreground)',
      '::placeholder': {
        color: 'var(--muted-foreground)',
      },
      backgroundColor: 'transparent',
      ':-webkit-autofill': {
        color: 'var(--foreground)',
      },
    },
    invalid: {
      color: 'var(--destructive)',
      iconColor: 'var(--destructive)',
    },
  },
  hidePostalCode: true,
  layout: {
    type: 'tabs',
    defaultCollapsed: false,
  },
};

function CheckoutForm({ amount, currency, onSuccess, onError, onClose, onProcessingChange }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { payment } = useUserService();

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

      const { clientSecret } = resultPayment.data;
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
        toast.success('Payment successful! Tokens have been minted.');
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
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Details</label>
            <div className="p-3 border rounded-md bg-background">
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
              <p className="text-lg font-semibold">{amount} {currency}</p>
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Checkout</DialogTitle>
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