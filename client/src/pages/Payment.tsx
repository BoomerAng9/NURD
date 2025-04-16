import React, { useState } from 'react';
import StripePaymentWrapper from '../components/payments/stripe-payment-form';
import { PageTransition } from '../components/animations/page-transition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const programTiers = [
  {
    id: 'tier-1',
    name: 'Basic',
    description: 'Essential NURD experience',
    price: 9900, // $99.00
    features: [
      'Weekly coding sessions',
      'Basic project materials',
      'Web development fundamentals',
      'Community forum access'
    ]
  },
  {
    id: 'tier-2',
    name: 'Premium',
    description: 'Enhanced NURD experience',
    price: 19900, // $199.00
    features: [
      'All Basic features',
      '2x weekly coding sessions',
      'Advanced project materials',
      'AI tools access',
      '1-on-1 mentoring (1 session)'
    ]
  },
  {
    id: 'tier-3',
    name: 'Ultimate',
    description: 'Complete NURD experience',
    price: 29900, // $299.00
    features: [
      'All Premium features',
      '3x weekly coding sessions',
      'Premium project materials',
      'Unlimited AI tools access',
      '1-on-1 mentoring (3 sessions)',
      'Certificate of completion'
    ]
  }
];

const Payment: React.FC = () => {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const handleTierSelection = (tierId: string) => {
    setSelectedTier(tierId);
    setShowPaymentForm(false);
  };
  
  const handleProceedToPayment = () => {
    if (selectedTier) {
      setShowPaymentForm(true);
    } else {
      toast({
        title: "Please select a tier",
        description: "You need to select a program tier before proceeding to payment.",
        variant: "destructive"
      });
    }
  };
  
  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    // Further processing can be done here, like updating user subscription status
  };
  
  const selectedTierDetails = selectedTier 
    ? programTiers.find(tier => tier.id === selectedTier) 
    : null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#121645] mb-2">NURD Program Enrollment</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select your preferred tier and complete the payment to enroll in the NURD program.
              </p>
            </div>
            
            {!showPaymentForm ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {programTiers.map((tier) => (
                    <Card 
                      key={tier.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedTier === tier.id 
                          ? 'ring-2 ring-blue-500 shadow-lg transform scale-[1.02]' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleTierSelection(tier.id)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                        <CardDescription>{tier.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <span className="text-2xl font-bold text-[#121645]">${(tier.price / 100).toFixed(2)}</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          {tier.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button 
                    className="px-8 py-2 bg-[#3B82F6] hover:bg-[#2563EB]"
                    onClick={handleProceedToPayment}
                    disabled={!selectedTier}
                  >
                    {selectedTier ? `Proceed to Payment ($${(selectedTierDetails?.price || 0) / 100})` : 'Select a Tier'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-6">
                <Button 
                  variant="ghost" 
                  className="mb-4"
                  onClick={() => setShowPaymentForm(false)}
                >
                  ← Back to Program Selection
                </Button>
                
                <StripePaymentWrapper 
                  amount={selectedTierDetails?.price || 0}
                  description={`NURD ${selectedTierDetails?.name} Program Enrollment`}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPaymentForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Payment;