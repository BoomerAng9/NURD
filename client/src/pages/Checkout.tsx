import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside of a component to avoid recreating the Stripe object on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Internal CheckoutForm component
const CheckoutForm = ({ planName, planPrice }: { planName: string, planPrice: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [, navigate] = useLocation();

  // Handle form submission for payment
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    // Confirm the payment with Stripe.js
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      // Show error message
      setMessage(error.message || 'An unexpected error occurred.');
      toast({
        title: 'Payment Error',
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Show success message
      setSuccess(true);
      setMessage('Payment successful! Redirecting to your dashboard...');
      toast({
        title: 'Payment Successful',
        description: 'Thank you for your subscription! You now have full access to VIBE.',
      });
      
      // The user's subscription details are already stored in the database 
      // through the Stripe webhook handlers, but we'll set localStorage for client-side
      // state management
      localStorage.setItem('subscription_active', 'true');
      localStorage.setItem('subscription_plan', planName);
      localStorage.setItem('subscription_date', new Date().toISOString());
      
      // Redirect to checkout success page after a short delay
      setTimeout(() => {
        navigate('/checkout-success');
      }, 2000);
    } else {
      setMessage('Payment pending or processing.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <PaymentElement />
        
        <div className="text-sm text-gray-400 bg-gray-800/50 rounded-md p-3">
          <p>Your subscription for the <span className="font-semibold text-white">{planName}</span> plan will begin immediately upon successful payment.</p>
        </div>
        
        {message && (
          <div className={`p-3 rounded-md flex items-center gap-2 ${success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <p>{message}</p>
          </div>
        )}
        
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/subscription-plans')}
            disabled={isProcessing}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={!stripe || isProcessing || success} 
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Complete Payment'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

// Main Checkout component
const Checkout = () => {
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();
  
  // Extract plan details from URL params
  const planId = searchParams.get('plan');
  const clientSecretFromUrl = searchParams.get('client_secret');
  
  // Determine plan name and price
  const getPlanDetails = (planId: string | null) => {
    switch(planId) {
      case 'basic':
        return { name: 'Basic Plan', price: 49.99 };
      case 'standard':
        return { name: 'Standard Plan', price: 99.99 };
      case 'premium':
        return { name: 'Premium Plan', price: 199.99 };
      default:
        return { name: 'Unknown Plan', price: 0 };
    }
  };
  
  const { name: planName, price: planPrice } = getPlanDetails(planId);

  // If both planId and clientSecret are missing, redirect to plans page
  useEffect(() => {
    if (!planId && !clientSecretFromUrl) {
      navigate('/subscription-plans');
    }
    
    // If client secret is provided in URL, use it
    if (clientSecretFromUrl) {
      setClientSecret(clientSecretFromUrl);
      setLoading(false);
    } else if (planId) {
      // Otherwise, need to create a new payment intent
      setLoading(true);
      
      // Create a subscription through our API
      import('@/services/stripe-service')
        .then(({ createSubscription }) => {
          return createSubscription({
            plan: planId,
          });
        })
        .then((response) => {
          setClientSecret(response.clientSecret);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error creating subscription:', err);
          setError(err.message || 'Failed to create subscription');
          setLoading(false);
        });
    }
  }, [planId, clientSecretFromUrl, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
        <Card className="max-w-md w-full border-red-500/30">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/20 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-center">Checkout Error</CardTitle>
            <CardDescription className="text-center">{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => navigate('/subscription-plans')} 
              className="w-full"
            >
              Return to Subscription Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Session Expired</CardTitle>
            <CardDescription className="text-center">
              Your checkout session has expired or is invalid. Please return to the subscription page to start over.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => navigate('/subscription-plans')} 
              className="w-full"
            >
              Return to Subscription Plans
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Configure Stripe Elements options
  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#6366f1',
        colorBackground: '#1f2937',
        colorText: '#f9fafb',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/attached_assets/Made in Pooler .png" 
              alt="Made in Pooler, GA" 
              className="h-20 object-contain" 
            />
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Complete Your Subscription
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto">
            You're just one step away from unlocking the full potential of VIBE
            and joining the NURD community!
          </p>
        </div>

        {/* Checkout Card */}
        <Card className="border-gray-700 mb-12">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Checkout</span>
              <span className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                ${planPrice.toFixed(2)}/month
              </span>
            </CardTitle>
            <CardDescription>
              {planName} - Monthly Subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm planName={planName} planPrice={planPrice} />
            </Elements>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 p-3 rounded-full mb-2">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-8v2h2v-2h-2zm0-8v6h2V6h-2z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-400">Secure Checkout</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 p-3 rounded-full mb-2">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-9.5l5.5-5.5-1.41-1.41L12 9.67l-4.09-4.08L6.5 7l5.5 5.5z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-400">SSL Encrypted</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 p-3 rounded-full mb-2">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 8l-7 7-7-7 1.41-1.41L12 12.17l5.59-5.58L19 8z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-400">Cancel Anytime</span>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-gray-400 text-sm">
          <p>Need help? Contact us at support@nurdinitiative.com</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;