import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { createPaymentIntent, createSubscription } from '@/services/stripe-service';
import { 
  Check, 
  Star, 
  Zap, 
  Code,  
  Sparkles, 
  Users,
  MessageSquare, 
  BookOpen,
  Crown,
  Compass,
  PenTool,
  Calendar
} from 'lucide-react';

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    feedback: '',
    rating: '5',
    wouldRecommend: false,
    interests: {
      vibeCoding: false,
      worldBuilder: false,
      promptMastery: false,
      collaborationStudio: false
    }
  });

  // Function to handle feedback submission
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send data to an API endpoint
    console.log("Feedback submitted:", feedbackData);
    
    // Show success toast
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your valuable feedback!",
    });
    
    // Close dialog
    setIsFeedbackOpen(false);
  };

  // Function to update interests in feedback
  const handleInterestChange = (interest: string, checked: boolean) => {
    setFeedbackData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        [interest]: checked
      }
    }));
  };

  // Function to handle plan selection
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  // Function to handle checkout process
  const handleCheckout = async () => {
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select a subscription plan to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (selectedPlan === 'subscription') {
        // Get the price amount based on billing cycle
        const priceAmount = selectedBillingCycle === 'monthly' ? 29 : 299;
        
        // Create a subscription
        const response = await createSubscription({
          plan: selectedBillingCycle === 'monthly' ? 'monthly' : 'yearly'
        });
        
        // Redirect to checkout page with subscription data
        window.location.href = `/checkout?plan=${selectedPlan}&billing=${selectedBillingCycle}&client_secret=${response.clientSecret}`;
      } else if (selectedPlan === 'bootcamp') {
        // Create a one-time payment intent for boot camp
        const { clientSecret } = await createPaymentIntent({
          amount: 499,
          currency: 'usd',
          description: 'VIBE Boot Camp - One-time Payment'
        });
        
        // Redirect to checkout page
        window.location.href = `/checkout?plan=${selectedPlan}&client_secret=${clientSecret}`;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 mb-4">
            Choose Your V.I.B.E. Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Unlock the full potential of your coding journey with our subscription plans.
            Get unlimited access to AI-powered coding tools and become a true NURD!
          </p>
        </div>

        {/* Made in Pooler Logo */}
        <div className="flex justify-center mb-12">
          <img 
            src="/attached_assets/Made in Pooler .png" 
            alt="Made in Pooler, GA" 
            className="h-24 object-contain" 
          />
        </div>

        {/* New Pricing Structure Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 p-4 rounded-lg mb-8 shadow-xl">
          <p className="text-white text-center text-lg font-semibold">
            New pricing! Unlimited VIBE access for $29/mo – or join our expert-led Boot Camp for $499.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* NURD Subscription Plan */}
          <Card 
            className={`border-2 relative transition-all duration-300 hover:shadow-xl ${
              selectedPlan === 'subscription' 
                ? 'border-blue-500 shadow-blue-500/20 scale-105 z-10' 
                : 'border-gray-700 hover:border-blue-500/50'
            }`}
            onClick={() => handlePlanSelect('subscription')}
          >
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <Badge className="bg-gradient-to-r from-blue-400 to-teal-500 px-4 py-1 text-white">
                MOST POPULAR
              </Badge>
            </div>
            <CardHeader className="pb-4 pt-8">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  SUBSCRIPTION
                </Badge>
                {selectedPlan === 'subscription' && (
                  <Badge className="bg-blue-500 text-white">Selected</Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-bold">NURD Subscription</CardTitle>
              <CardDescription>Unlimited access to all V.I.B.E. features</CardDescription>
              
              {/* Billing Toggle */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div 
                    className={`cursor-pointer px-4 py-2 rounded-l-md flex-1 text-center ${
                      selectedBillingCycle === 'monthly' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBillingCycle('monthly');
                    }}
                  >
                    Monthly
                  </div>
                  <div 
                    className={`cursor-pointer px-4 py-2 rounded-r-md flex-1 text-center ${
                      selectedBillingCycle === 'yearly' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBillingCycle('yearly');
                    }}
                  >
                    Yearly (Save 20%)
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">${selectedBillingCycle === 'monthly' ? '29' : '299'}</span>
                  <span className="text-gray-400">/{selectedBillingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited access to VIBE</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Step-by-step Vibe Coding Foundations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>World Builder Lab for AI-powered world-building</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Live Collaboration Studio (real-time coding + chat)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Built-in Prompt Coach & token-saving tips</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access to all AI models</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanSelect('subscription');
                }}
              >
                {selectedPlan === 'subscription' ? 'Selected' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>

          {/* VIBE Boot Camp Plan */}
          <Card 
            className={`border-2 transition-all duration-300 hover:shadow-lg ${
              selectedPlan === 'bootcamp' 
                ? 'border-purple-500 shadow-purple-500/20' 
                : 'border-gray-700 hover:border-purple-500/50'
            }`}
            onClick={() => handlePlanSelect('bootcamp')}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                  ONE-TIME
                </Badge>
                {selectedPlan === 'bootcamp' && (
                  <Badge className="bg-purple-500 text-white">Selected</Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-bold">VIBE Boot Camp</CardTitle>
              <CardDescription>Professional training & personalized feedback</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$499</span>
                <span className="text-gray-400"> one-time</span>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>6-week live cohort with professional trainers</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Small-group projects + personalized feedback</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Deep dive into prompt engineering, AI ethics, and coding</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Certificate of Completion + demo showcase</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority email & chat support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Includes 3 months of NURD Subscription</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanSelect('bootcamp');
                }}
              >
                {selectedPlan === 'bootcamp' ? 'Selected' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Subscription Features */}
        <div className="bg-gray-800/50 rounded-xl p-8 mb-16 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">All Plans Include</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-blue-500/20 p-3 rounded-full mb-4">
                <Code className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Code Generation</h3>
              <p className="text-gray-400 text-sm">Generate code from simple English descriptions</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-teal-500/20 p-3 rounded-full mb-4">
                <BookOpen className="h-6 w-6 text-teal-400" />
              </div>
              <h3 className="font-semibold mb-2">Code Explanations</h3>
              <p className="text-gray-400 text-sm">Understand complex code with simple explanations</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-purple-500/20 p-3 rounded-full mb-4">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Code Completion</h3>
              <p className="text-gray-400 text-sm">Finish your code automatically with AI suggestions</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-pink-500/20 p-3 rounded-full mb-4">
                <Crown className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="font-semibold mb-2">Learning Milestones</h3>
              <p className="text-gray-400 text-sm">Track your progress with achievements and rewards</p>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="flex flex-col items-center justify-center mb-16">
          <Button 
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-6 text-xl rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl"
            onClick={handleCheckout}
            disabled={!selectedPlan}
          >
            {selectedPlan ? 'Continue to Checkout' : 'Select a Plan to Continue'}
          </Button>
          <p className="text-gray-400 mt-4 text-center">
            Secure payments powered by Stripe. Cancel anytime.
          </p>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">What Our NURDs Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "VIBE has completely changed how I approach coding. As a beginner, the explanations 
                  and step-by-step guidance have been invaluable. I'm building projects I never thought I could!"
                </p>
                <div className="flex items-center">
                  <div className="mr-3 bg-blue-500/30 text-blue-300 font-bold rounded-full h-10 w-10 flex items-center justify-center">
                    JS
                  </div>
                  <div>
                    <p className="font-semibold">Jamie S.</p>
                    <p className="text-sm text-gray-400">High School Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "The code narrator feature is amazing for accessibility. As a teacher, I use VIBE to 
                  help my students understand programming concepts in a way that's easy and engaging."
                </p>
                <div className="flex items-center">
                  <div className="mr-3 bg-teal-500/30 text-teal-300 font-bold rounded-full h-10 w-10 flex items-center justify-center">
                    MT
                  </div>
                  <div>
                    <p className="font-semibold">Michael T.</p>
                    <p className="text-sm text-gray-400">Computer Science Teacher</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "Since joining the NURD community, my daughter has developed a real passion for coding. 
                  The gamified learning approach keeps her engaged and she's learning real-world skills!"
                </p>
                <div className="flex items-center">
                  <div className="mr-3 bg-purple-500/30 text-purple-300 font-bold rounded-full h-10 w-10 flex items-center justify-center">
                    KL
                  </div>
                  <div>
                    <p className="font-semibold">Karen L.</p>
                    <p className="text-sm text-gray-400">Parent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">What is VIBE and how does it work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  VIBE (Vibrant Imagination Build Environment) is an AI-powered coding platform that helps users
                  generate, understand, and complete code. It uses advanced AI models to transform simple English 
                  descriptions into working code, explain complex code in simple terms, and help you complete code you've started.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription at any time?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Yes, you can cancel your subscription at any time with no cancellation fees. Your access will continue until 
                  the end of your current billing period, after which it won't renew.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">What if I run out of tokens?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  If you run out of tokens on the Basic or Standard plan, you can either upgrade to a higher tier or wait 
                  until your next billing cycle when your tokens reset. Premium plan users enjoy unlimited tokens.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Is VIBE suitable for complete beginners?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Absolutely! VIBE is designed with beginners in mind. The platform uses simple language to explain coding concepts,
                  generates code from plain English descriptions, and provides step-by-step explanations to help you learn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feedback Button */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">We Value Your Feedback</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Help us improve VIBE and the NURD Initiative by sharing your thoughts, suggestions, or feature requests!
          </p>
          <Button 
            className="bg-teal-600 hover:bg-teal-700 px-6"
            onClick={() => setIsFeedbackOpen(true)}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Share Your Feedback
          </Button>
        </div>

        {/* Feedback Dialog */}
        <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
          <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle>Share Your Feedback</DialogTitle>
              <DialogDescription className="text-gray-400">
                Your feedback helps us improve the NURD experience for everyone.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="col-span-3 bg-gray-800 border-gray-700"
                    value={feedbackData.name}
                    onChange={(e) => setFeedbackData({...feedbackData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="your.email@example.com"
                    className="col-span-3 bg-gray-800 border-gray-700"
                    value={feedbackData.email}
                    onChange={(e) => setFeedbackData({...feedbackData, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feedback" className="text-right">
                    Feedback
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts, suggestions, or experiences..."
                    className="col-span-3 bg-gray-800 border-gray-700"
                    value={feedbackData.feedback}
                    onChange={(e) => setFeedbackData({...feedbackData, feedback: e.target.value})}
                  />
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Rating
                  </Label>
                  <RadioGroup 
                    className="col-span-3 flex space-x-2" 
                    value={feedbackData.rating}
                    onValueChange={(value) => setFeedbackData({...feedbackData, rating: value})}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-1">
                        <RadioGroupItem value={String(value)} id={`rating-${value}`} />
                        <Label htmlFor={`rating-${value}`}>{value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Recommend
                  </Label>
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="recommend" 
                        checked={feedbackData.wouldRecommend}
                        onCheckedChange={(checked) => 
                          setFeedbackData({...feedbackData, wouldRecommend: checked as boolean})
                        }
                      />
                      <Label htmlFor="recommend">I would recommend NURD to others</Label>
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    Learning Tracks
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="vibeCoding" 
                        checked={feedbackData.interests.vibeCoding}
                        onCheckedChange={(checked) => 
                          handleInterestChange('vibeCoding', checked as boolean)
                        }
                      />
                      <Label htmlFor="vibeCoding">Vibe Coding Foundations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="worldBuilder" 
                        checked={feedbackData.interests.worldBuilder}
                        onCheckedChange={(checked) => 
                          handleInterestChange('worldBuilder', checked as boolean)
                        }
                      />
                      <Label htmlFor="worldBuilder">World Builder Lab</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="promptMastery" 
                        checked={feedbackData.interests.promptMastery}
                        onCheckedChange={(checked) => 
                          handleInterestChange('promptMastery', checked as boolean)
                        }
                      />
                      <Label htmlFor="promptMastery">Prompt Mastery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="collaborationStudio" 
                        checked={feedbackData.interests.collaborationStudio}
                        onCheckedChange={(checked) => 
                          handleInterestChange('collaborationStudio', checked as boolean)
                        }
                      />
                      <Label htmlFor="collaborationStudio">Collaboration Studio</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Submit Feedback</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bottom CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Join the NURD Community Today!
          </h2>
          <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
            Become part of a growing community of creative coders, prompt engineers, and tech innovators. 
            Learn, build, and grow with VIBE – where coding meets imagination!
          </p>
          <Button 
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-6 text-xl rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl"
            onClick={handleCheckout}
            disabled={!selectedPlan}
          >
            {selectedPlan ? 'Get Started Now' : 'Choose Your Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;