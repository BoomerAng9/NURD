import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createPaymentIntent } from '../../services/stripe-service';
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

interface PaymentFormProps {
  amount: number;
  description: string;
  onSuccess?: (paymentId: string) => void;
  onCancel?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount = 0, 
  description = 'Payment',
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Only fetch client secret if amount is valid
    if (amount > 0) {
      setIsProcessing(true);
      createPaymentIntent({
        amount: amount,
        currency: 'usd',
        description: description,
      })
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
          setIsError(true);
          setErrorMessage('Failed to initialize payment. Please try again later.');
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }, [amount, description]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe hasn't loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    if (!email || !name) {
      setErrorMessage('Please provide your email and name');
      return;
    }

    setIsProcessing(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email: email,
          },
        },
      });

      if (error) {
        setIsError(true);
        setErrorMessage(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent?.status === 'succeeded') {
        setIsCompleted(true);
        if (onSuccess) {
          onSuccess(paymentIntent.id);
        }
        
        toast({
          title: 'Payment successful',
          description: `Thank you for your payment of $${(amount / 100).toFixed(2)}`,
          variant: "default"
        });
      } else {
        setIsError(true);
        setErrorMessage('Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setIsError(true);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCompleted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <p className="text-center text-gray-700">
            Thank you for your payment of ${(amount / 100).toFixed(2)}
          </p>
          <p className="text-center text-gray-500 text-sm">
            A receipt has been sent to your email.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => window.location.href = '/'}
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>
          {description} - ${(amount / 100).toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="card-element">Card Details</Label>
            <div className="p-3 border rounded-md bg-white">
              <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
          
          {isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {errorMessage}
            </div>
          )}
          
          <div className="pt-2">
            <Button 
              type="submit"
              disabled={isProcessing || !stripe || !elements || !clientSecret} 
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${(amount / 100).toFixed(2)}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                className="w-full mt-2"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

interface StripePaymentWrapperProps extends PaymentFormProps {}

export const StripePaymentWrapper: React.FC<StripePaymentWrapperProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePaymentWrapper;