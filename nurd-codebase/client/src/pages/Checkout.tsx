import React, { useState, useEffect, Component } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside of a component to avoid recreating the Stripe object on renders
// Make sure we have the key before attempting to load Stripe
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Checking if the key is properly defined and not a string "undefined"
const isValidKey = stripePublicKey && stripePublicKey !== 'undefined' && stripePublicKey.startsWith('pk_');

// Set up a detailed warning if the key isn't valid
if (!isValidKey) {
  console.error('=== STRIPE KEY MISSING OR INVALID ===');
  console.error('Current value: ', stripePublicKey ? `"${stripePublicKey}"` : 'undefined');
  console.error('Please make sure VITE_STRIPE_PUBLIC_KEY is set correctly in your environment.');
  console.error('Valid Stripe publishable keys start with "pk_"');
  console.error('=====================');
  
  // Display a visual warning in the console for easier debugging
  console.log('%c STRIPE KEY ERROR ', 'background: #ff0000; color: white; font-size: 14px; font-weight: bold; padding: 4px 8px;');
}

// Create a safe wrapper that won't crash the app if the key is invalid
const stripePromise = (() => {
  try {
    // Only load Stripe if we have a valid key
    if (isValidKey) {
      return loadStripe(stripePublicKey);
    } else {
      // Return a rejected promise with a helpful error message
      return Promise.reject(
        new Error('Stripe publishable key is missing or invalid. Check console for details.')
      );
    }
  } catch (err) {
    console.error('Error initializing Stripe:', err);
    return Promise.reject(err);
  }
})();

// Internal CheckoutForm component
const CheckoutForm = ({ 
  planName, 
  planPrice, 
  isOneTime, 
  isYearly 
}: { 
  planName: string, 
  planPrice: number,
  isOneTime?: boolean,
  isYearly?: boolean
}) => {
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
          {isOneTime ? (
            <p>Your <span className="font-semibold text-white">{planName}</span> access will begin immediately upon successful payment.</p>
          ) : (
            <p>Your subscription for the <span className="font-semibold text-white">{planName}</span> plan will begin immediately upon successful payment.</p>
          )}
          {isYearly && (
            <p className="mt-2 text-teal-400">You've selected the annual plan and saved over 15% compared to monthly billing!</p>
          )}
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
  
  // Get billing cycle from URL params
  const billingCycle = searchParams.get('billing') || 'monthly';
  
  // Determine plan name and price
  const getPlanDetails = (planId: string | null) => {
    switch(planId) {
      case 'subscription':
        if (billingCycle === 'yearly') {
          return { name: 'NURD Subscription (Annual)', price: 299, isYearly: true };
        }
        return { name: 'NURD Subscription', price: 29, isYearly: false };
      case 'bootcamp':
        return { name: 'VIBE Boot Camp', price: 499, isOneTime: true };
      default:
        return { name: 'Unknown Plan', price: 0, isYearly: false };
    }
  };
  
  const planDetails = getPlanDetails(planId);
  const planName = planDetails.name;
  const planPrice = planDetails.price;
  const isOneTime = planDetails.isOneTime || false;
  const isYearly = planDetails.isYearly || false;

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
        .then((stripeService) => {
          if (isOneTime) {
            // For one-time payments like the bootcamp
            return stripeService.createPaymentIntent({
              amount: planPrice,
              currency: 'usd',
              description: planName,
            }).then(response => {
              return { clientSecret: response.clientSecret };
            });
          } else {
            // For subscription plans (monthly or yearly)
            return stripeService.createSubscription({
              plan: planId as string,
              billingCycle: billingCycle === 'yearly' ? 'yearly' : 'monthly',
            }).then(response => {
              return { clientSecret: response.clientSecret };
            });
          }
        })
        .then((response) => {
          // Both payment intent and subscription responses have clientSecret
          if (response && response.clientSecret) {
            setClientSecret(response.clientSecret);
            setLoading(false);
          } else {
            throw new Error('Invalid response from payment service');
          }
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
                ${planPrice.toFixed(2)}{isOneTime ? '' : isYearly ? '/year' : '/month'}
              </span>
            </CardTitle>
            <CardDescription>
              {planName}{isOneTime ? ' - One-time Payment' : isYearly ? ' - Annual Subscription' : ' - Monthly Subscription'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ErrorBoundary fallback={
              <div className="p-4 border border-red-500/30 rounded-md bg-red-950/20 text-red-300">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="font-medium">Payment System Error</h3>
                </div>
                <p className="text-sm">
                  We're experiencing issues with our payment system. Please try again later or contact support.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-red-500/30 hover:bg-red-950/40 text-red-300"
                  onClick={() => window.location.href = '/subscription-plans'}
                >
                  Return to Plans
                </Button>
              </div>
            }>
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CheckoutForm 
                  planName={planName} 
                  planPrice={planPrice} 
                  isOneTime={isOneTime} 
                  isYearly={isYearly} 
                />
              </Elements>
            </ErrorBoundary>
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

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: any) {
    console.error("Checkout error boundary caught:", error);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}

export default Checkout;