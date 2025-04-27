'use client';

// pages/checkout.js
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserService } from '@/hooks/use-user-service';
import { useTokenService } from '@/hooks/use-token-service';

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

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { payment } = useUserService();
  const { mintToken } = useTokenService();

  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // Ensure amount is a valid number
      const numericAmount = Number(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Invalid amount');
      }

      // 1. Create Payment Intent using user service
      const resultPayment = await payment({currency, amountPaid: numericAmount});
      if (!resultPayment.success) {
        throw new Error(resultPayment.message);
      }

      const { clientSecret } = resultPayment.data;
      if (!clientSecret) {
        throw new Error('No client secret received');
      }

      // 2. Confirm Payment on client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        // 3. Mint tokens after successful payment
        const mintResult = await mintToken(currency, numericAmount);
        if (!mintResult.success) {
          throw new Error(mintResult.message);
        }

        toast.success('Payment successful! Tokens have been minted.');
        // Redirect to profile page
        router.push('/profile');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (!amount || !currency) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Invalid checkout parameters. Please return to the wallet page.
          </p>
        </CardContent>
      </Card>
    );
  }

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

export default function CheckoutPage() {
  return (
    <div className="container max-w-2xl py-8">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
