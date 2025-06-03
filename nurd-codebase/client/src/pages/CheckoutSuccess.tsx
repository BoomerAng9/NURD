import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Rocket, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const CheckoutSuccess = () => {
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState(5);
  const searchParams = new URLSearchParams(window.location.search);
  const paymentIntentId = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
  
  // Trigger confetti effect on mount
  useEffect(() => {
    // Launch confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/dashboard');
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <img 
            src="/attached_assets/Made in Pooler .png" 
            alt="Made in Pooler, GA" 
            className="h-24 object-contain" 
          />
        </div>
        
        <Card className="border-green-500/30 shadow-lg shadow-green-500/5">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/20 h-20 w-20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6 pb-2">
            <p className="text-gray-300">
              Thank you for subscribing to VIBE! Your payment has been processed successfully.
            </p>
            
            <div className="bg-gray-800/70 rounded-lg p-4">
              <h3 className="font-medium text-green-400 flex items-center justify-center gap-2 mb-3">
                <Sparkles className="h-5 w-5" />
                Welcome to the NURD Community!
              </h3>
              <p className="text-sm text-gray-400">
                Your subscription is now active and you have full access to all the features based on your subscription plan.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-200">What's next?</h3>
              <ul className="space-y-2 text-sm text-left">
                <li className="flex items-start gap-2">
                  <Rocket className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Explore the full power of V.I.B.E. with your new subscription</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Complete your profile to personalize your experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-pink-400 flex-shrink-0 mt-0.5" />
                  <span>Start earning achievements and track your progress</span>
                </li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-400">
              You'll be redirected to your dashboard in {countdown} seconds...
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
            >
              Go to Dashboard Now
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>A confirmation email has been sent to your email address.</p>
          <p className="mt-2">Questions? Contact us at support@nurdinitiative.com</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;