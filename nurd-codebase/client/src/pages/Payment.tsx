import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, CheckCircle, CreditCard, Calendar, Gift, Clock } from 'lucide-react';
import { Link } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/use-toast';

// This would come from environment variables in a production environment
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = loadStripe(stripePublishableKey);

// Stripe might not be configured yet, so we'll create a placeholder
const StripePaymentForm = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [missingKey, setMissingKey] = useState(false);

  useEffect(() => {
    // Check if we have the stripe publishable key
    if (!stripePublishableKey) {
      setMissingKey(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      if (missingKey) {
        toast({
          title: "Configuration Error",
          description: "Stripe API key is missing. Please contact support.",
          variant: "destructive"
        });
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
        setIsComplete(true);
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully!",
          variant: "default"
        });
      }
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-6">Thank you for your purchase. You now have access to NURD Premium features.</p>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {missingKey && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Configuration Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Stripe API key is missing. This is just a demo interface. In a production environment, you would need to provide a valid Stripe publishable key.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card Number</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="card-number"
              className="pl-10 block w-full border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
              placeholder="4242 4242 4242 4242"
              disabled={isProcessing}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">Expiration</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="expiration"
                className="pl-10 block w-full border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                placeholder="MM / YY"
                disabled={isProcessing}
              />
            </div>
          </div>
          <div>
            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
            <div className="mt-1">
              <input
                type="text"
                id="cvc"
                className="block w-full border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                placeholder="123"
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name on Card</label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              className="block w-full border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
              placeholder="John Doe"
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90" 
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

const Payment: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8 text-center">NURD Membership Options</h1>
        
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="monthly" className="text-center py-2">Monthly</TabsTrigger>
            <TabsTrigger value="yearly" className="text-center py-2">Yearly</TabsTrigger>
            <TabsTrigger value="lifetime" className="text-center py-2">Lifetime</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For beginners and hobbyists</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Access to Code Playground</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Basic AI code suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Community forum access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>5 project saves</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Select Basic</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-primary relative">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 transform translate-y-0 rounded-bl-lg">
                  POPULAR
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious developers</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$19.99</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced AI code generation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Code optimization suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>20 project saves</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90">Select Pro</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>For teams and organizations</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$49.99</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Team collaboration features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced API access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Unlimited project saves</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom integrations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Select Team</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="yearly" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For beginners and hobbyists</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$99.99</span>
                    <span className="text-gray-500 ml-1">/year</span>
                  </div>
                  <div className="mt-1 inline-flex items-center bg-green-100 px-2 py-1 rounded text-xs text-green-800">
                    <Gift className="h-3 w-3 mr-1" />
                    Save $19.89
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Access to Code Playground</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Basic AI code suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Community forum access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>5 project saves</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Select Basic</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-primary relative">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 transform translate-y-0 rounded-bl-lg">
                  POPULAR
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious developers</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$199.99</span>
                    <span className="text-gray-500 ml-1">/year</span>
                  </div>
                  <div className="mt-1 inline-flex items-center bg-green-100 px-2 py-1 rounded text-xs text-green-800">
                    <Gift className="h-3 w-3 mr-1" />
                    Save $39.89
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced AI code generation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Code optimization suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>20 project saves</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90">Select Pro</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>For teams and organizations</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$499.99</span>
                    <span className="text-gray-500 ml-1">/year</span>
                  </div>
                  <div className="mt-1 inline-flex items-center bg-green-100 px-2 py-1 rounded text-xs text-green-800">
                    <Gift className="h-3 w-3 mr-1" />
                    Save $99.89
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Team collaboration features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced API access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Unlimited project saves</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom integrations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Select Team</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="lifetime" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For beginners and hobbyists</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$299.99</span>
                    <span className="text-gray-500 ml-1">lifetime</span>
                  </div>
                  <div className="mt-1 inline-flex items-center bg-green-100 px-2 py-1 rounded text-xs text-green-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Lifetime Access
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Access to Code Playground</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Basic AI code suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Community forum access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>5 project saves</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Select Basic</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-primary relative">
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 transform translate-y-0 rounded-bl-lg">
                  BEST VALUE
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious developers</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$599.99</span>
                    <span className="text-gray-500 ml-1">lifetime</span>
                  </div>
                  <div className="mt-1 inline-flex items-center bg-green-100 px-2 py-1 rounded text-xs text-green-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Lifetime Access
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced AI code generation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Code optimization suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>20 project saves</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90">Select Pro</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-gray-200 hover:border-primary/50 transition-all">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>For teams and organizations</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">$1499.99</span>
                    <span className="text-gray-500 ml-1">lifetime</span>
                  </div>
                  <div className="mt-1 inline-flex items-center bg-green-100 px-2 py-1 rounded text-xs text-green-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Lifetime Access
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Everything in Pro</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Team collaboration features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced API access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Unlimited project saves</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom integrations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Select Team</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
          <Elements stripe={stripePromise}>
            <StripePaymentForm />
          </Elements>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help choosing a plan? <a href="#" className="text-primary hover:underline">Contact our sales team</a></p>
        </div>
      </div>
    </div>
  );
};

export default Payment;