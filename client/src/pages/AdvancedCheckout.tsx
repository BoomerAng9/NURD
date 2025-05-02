import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { createPaymentIntent, createSubscription } from '@/services/stripe-service';
import { 
  Check, 
  Zap, 
  Shield, 
  Code, 
  LucideIcon,
  Sparkles, 
  Trophy,
  Users,
  Rocket,
  Star,
  CircleHelp,
  Upload,
  Clock,
  LayoutGrid,
  Laptop,
  ChevronRight,
  Globe,
  BookOpen,
  Puzzle,
  Loader2,
  ArrowLeft
} from 'lucide-react';

// Define the development tier features
interface TierFeature {
  name: string;
  included: boolean;
  highlightLevel?: 'base' | 'premium' | 'elite'; // To highlight features in each tier
  icon: LucideIcon;
  description: string;
}

interface DevelopmentTier {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: TierFeature[];
  badge?: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

// Define the development tiers
const developmentTiers: DevelopmentTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for young coders just beginning their tech journey',
    priceMonthly: 29,
    priceYearly: 299,
    color: 'blue',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-teal-500',
    features: [
      { 
        name: 'VIBE Coding Environment', 
        included: true, 
        highlightLevel: 'base',
        icon: Code,
        description: 'Full access to our AI-powered coding platform'
      },
      { 
        name: 'Coding Foundations Learning Path', 
        included: true, 
        highlightLevel: 'base',
        icon: BookOpen,
        description: 'Step-by-step coding curriculum for beginners'
      },
      { 
        name: 'Basic Project Templates', 
        included: true, 
        highlightLevel: 'base',
        icon: LayoutGrid,
        description: 'Starter templates for common coding projects'
      },
      { 
        name: 'AI Model Access', 
        included: true, 
        highlightLevel: 'base',
        icon: Sparkles,
        description: 'Access to basic AI models'
      },
      { 
        name: 'Community Forum Access', 
        included: true, 
        highlightLevel: 'base',
        icon: Users,
        description: 'Connect with other learners'
      },
      { 
        name: 'Weekly Challenges', 
        included: true, 
        highlightLevel: 'base',
        icon: Trophy,
        description: 'Fun coding challenges to test your skills'
      },
      { 
        name: 'Basic Cloud Storage', 
        included: true, 
        highlightLevel: 'base',
        icon: Upload,
        description: '5GB of project storage'
      },
      { 
        name: 'Email Support', 
        included: true, 
        highlightLevel: 'base',
        icon: CircleHelp,
        description: 'Get help via email within 48 hours'
      },
      { 
        name: 'Private AI Projects', 
        included: false, 
        icon: Shield,
        description: 'Create private AI-powered projects'
      },
      { 
        name: 'Advanced AI Models', 
        included: false, 
        icon: Rocket,
        description: 'Access to premium AI models'
      },
      { 
        name: 'Mentor Sessions', 
        included: false, 
        icon: Users,
        description: 'One-on-one sessions with tech mentors'
      },
      { 
        name: 'Portfolio Development', 
        included: false, 
        icon: Star,
        description: 'Guided portfolio creation and refinement'
      }
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For ambitious young creators ready to take their skills to the next level',
    priceMonthly: 59,
    priceYearly: 599,
    badge: 'MOST POPULAR',
    color: 'purple',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-500',
    features: [
      { 
        name: 'VIBE Coding Environment', 
        included: true, 
        highlightLevel: 'base',
        icon: Code,
        description: 'Full access to our AI-powered coding platform'
      },
      { 
        name: 'Coding Foundations Learning Path', 
        included: true, 
        highlightLevel: 'base',
        icon: BookOpen,
        description: 'Step-by-step coding curriculum for beginners'
      },
      { 
        name: 'Advanced Project Templates', 
        included: true, 
        highlightLevel: 'premium',
        icon: LayoutGrid,
        description: 'Premium templates for diverse coding projects'
      },
      { 
        name: 'AI Model Access', 
        included: true, 
        highlightLevel: 'premium',
        icon: Sparkles,
        description: 'Access to premium AI models'
      },
      { 
        name: 'Community Forum Access', 
        included: true, 
        highlightLevel: 'base',
        icon: Users,
        description: 'Connect with other learners'
      },
      { 
        name: 'Weekly Challenges', 
        included: true, 
        highlightLevel: 'base',
        icon: Trophy,
        description: 'Fun coding challenges to test your skills'
      },
      { 
        name: 'Enhanced Cloud Storage', 
        included: true, 
        highlightLevel: 'premium',
        icon: Upload,
        description: '20GB of project storage'
      },
      { 
        name: 'Priority Support', 
        included: true, 
        highlightLevel: 'premium',
        icon: CircleHelp,
        description: 'Get help via email within 24 hours'
      },
      { 
        name: 'Private AI Projects', 
        included: true, 
        highlightLevel: 'premium',
        icon: Shield,
        description: 'Create private AI-powered projects'
      },
      { 
        name: 'Advanced AI Models', 
        included: true, 
        highlightLevel: 'premium',
        icon: Rocket,
        description: 'Access to premium AI models'
      },
      { 
        name: 'Mentor Sessions', 
        included: true, 
        highlightLevel: 'premium',
        icon: Users,
        description: 'Two monthly one-on-one sessions with tech mentors'
      },
      { 
        name: 'Portfolio Development', 
        included: true, 
        highlightLevel: 'premium',
        icon: Star,
        description: 'Guided portfolio creation and refinement'
      }
    ]
  },
  {
    id: 'elite',
    name: 'Elite Developer',
    description: 'Comprehensive development environment for future tech innovators',
    priceMonthly: 99,
    priceYearly: 999,
    color: 'amber',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-orange-500',
    features: [
      { 
        name: 'VIBE Coding Environment', 
        included: true, 
        highlightLevel: 'base',
        icon: Code,
        description: 'Full access to our AI-powered coding platform'
      },
      { 
        name: 'All Learning Paths', 
        included: true, 
        highlightLevel: 'elite',
        icon: BookOpen,
        description: 'All coding curricula including advanced topics'
      },
      { 
        name: 'All Project Templates', 
        included: true, 
        highlightLevel: 'elite',
        icon: LayoutGrid,
        description: 'Full library of premium coding templates'
      },
      { 
        name: 'All AI Models', 
        included: true, 
        highlightLevel: 'elite',
        icon: Sparkles,
        description: 'Access to all AI models including exclusive ones'
      },
      { 
        name: 'Community Leadership', 
        included: true, 
        highlightLevel: 'elite',
        icon: Users,
        description: 'Leadership opportunities within the community'
      },
      { 
        name: 'Weekly Challenges + Prizes', 
        included: true,
        highlightLevel: 'elite', 
        icon: Trophy,
        description: 'Advanced coding challenges with real prizes'
      },
      { 
        name: 'Unlimited Cloud Storage', 
        included: true, 
        highlightLevel: 'elite',
        icon: Upload,
        description: 'Unlimited project storage and deployment options'
      },
      { 
        name: 'VIP Support', 
        included: true, 
        highlightLevel: 'elite',
        icon: CircleHelp,
        description: 'Priority support with live chat and direct phone line'
      },
      { 
        name: 'Private AI Projects with Collaboration', 
        included: true, 
        highlightLevel: 'elite',
        icon: Shield,
        description: 'Create private AI-powered projects with team collaboration'
      },
      { 
        name: 'Advanced AI Models with Custom Fine-tuning', 
        included: true, 
        highlightLevel: 'elite',
        icon: Rocket,
        description: 'Custom AI model fine-tuning for your projects'
      },
      { 
        name: 'Unlimited Mentor Sessions', 
        included: true, 
        highlightLevel: 'elite',
        icon: Users,
        description: 'Unlimited one-on-one sessions with senior tech mentors'
      },
      { 
        name: 'Professional Portfolio Development', 
        included: true, 
        highlightLevel: 'elite',
        icon: Star,
        description: 'Professional portfolio creation with industry feedback'
      }
    ]
  }
];

// Bootcamp option (separate from the tiers)
const bootcampOption = {
  id: 'bootcamp',
  name: 'VIBE Boot Camp',
  description: 'Intensive 6-week program with professional trainers',
  price: 499,
  features: [
    '6-week live cohort with professional trainers',
    'Small-group projects + personalized feedback',
    'Deep dive into prompt engineering, AI ethics, and coding',
    'Certificate of Completion + demo showcase',
    'Priority email & chat support',
    'Includes 3 months of NURD Premium Subscription'
  ],
  color: 'emerald',
  gradientFrom: 'from-emerald-500',
  gradientTo: 'to-teal-500'
};

const AdvancedCheckout: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'plans' | 'features' | 'bootcamp'>('plans');
  const [, navigate] = useLocation();

  // Toggle billing cycle
  const toggleBillingCycle = () => {
    setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
  };

  // Handle tier selection
  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
  };

  // Handle bootcamp selection
  const handleBootcampSelect = () => {
    setSelectedTier('bootcamp');
    setActiveSection('bootcamp');
  };

  // Handle feature toggle
  const handleFeatureToggle = (featureName: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureName) 
        ? prev.filter(f => f !== featureName) 
        : [...prev, featureName]
    );
  };

  // Proceed to checkout
  const handleProceedToCheckout = async () => {
    if (!selectedTier) {
      toast({
        title: "Please Select a Plan",
        description: "You need to select a development tier to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (selectedTier === 'bootcamp') {
        // Handle bootcamp checkout (one-time payment)
        const { clientSecret } = await createPaymentIntent({
          amount: bootcampOption.price,
          currency: 'usd',
          description: 'VIBE Boot Camp - One-time Payment'
        });
        
        // Redirect to checkout
        window.location.href = `/checkout?plan=${selectedTier}&client_secret=${clientSecret}`;
      } else {
        // Handle subscription tier checkout
        const tier = developmentTiers.find(tier => tier.id === selectedTier);
        
        if (tier) {
          const amount = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;
          
          const response = await createSubscription({
            plan: billingCycle,
            // Add additional parameters if needed for the advanced checkout
            // For example: features: selectedFeatures
          });
          
          // Redirect to checkout
          window.location.href = `/checkout?plan=${selectedTier}&billing=${billingCycle}&client_secret=${response.clientSecret}&tier=${tier.name}`;
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Get the dynamic card styling based on the tier
  const getCardClass = (tierId: string) => {
    const isSelected = selectedTier === tierId;
    
    if (tierId === 'starter') {
      return `border-2 ${isSelected ? 'border-blue-500 shadow-blue-500/20 scale-105 z-10' : 'border-gray-700 hover:border-blue-500/50'}`;
    } else if (tierId === 'premium') {
      return `border-2 ${isSelected ? 'border-purple-500 shadow-purple-500/20 scale-105 z-10' : 'border-gray-700 hover:border-purple-500/50'}`;
    } else if (tierId === 'elite') {
      return `border-2 ${isSelected ? 'border-amber-500 shadow-amber-500/20 scale-105 z-10' : 'border-gray-700 hover:border-amber-500/50'}`;
    } else {
      return `border-2 ${isSelected ? 'border-emerald-500 shadow-emerald-500/20 scale-105 z-10' : 'border-gray-700 hover:border-emerald-500/50'}`;
    }
  };

  // Get button class based on tier
  const getButtonClass = (tierId: string) => {
    if (tierId === 'starter') {
      return 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600';
    } else if (tierId === 'premium') {
      return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
    } else if (tierId === 'elite') {
      return 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600';
    } else {
      return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600';
    }
  };

  // Get badge class based on feature highlight level
  const getFeatureBadgeClass = (highlightLevel?: string) => {
    if (highlightLevel === 'premium') {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    } else if (highlightLevel === 'elite') {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    } else {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
    >
      <Helmet>
        <title>Advanced Development Tiers | NURD by ACHIEVEMOR</title>
        <meta 
          name="description" 
          content="Choose from our advanced development tiers tailored to different skill levels and needs. Unlock your full coding potential with NURD."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4"
          >
            Advanced Development Tiers
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Choose the perfect tier to match your coding journey. From beginners to advanced coders, 
            we have options tailored to help you grow and excel.
          </motion.p>
        </div>

        {/* Main Tabs Navigation */}
        <Tabs 
          defaultValue="plans" 
          className="mb-10"
          onValueChange={(value) => setActiveSection(value as any)}
        >
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-10">
            <TabsTrigger value="plans">Development Tiers</TabsTrigger>
            <TabsTrigger value="features">Compare Features</TabsTrigger>
            <TabsTrigger value="bootcamp">Boot Camp</TabsTrigger>
          </TabsList>

          {/* Development Tiers Section */}
          <TabsContent value="plans" className="mt-4 space-y-8">
            {/* Billing Toggle */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white font-medium' : 'text-gray-400'}`}>
                  Monthly
                </span>
                <div className="relative">
                  <Switch 
                    checked={billingCycle === 'yearly'} 
                    onCheckedChange={toggleBillingCycle}
                  />
                  <div className="absolute -top-4 -right-4">
                    <Badge className="bg-green-500 text-white text-xs">Save 20%</Badge>
                  </div>
                </div>
                <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white font-medium' : 'text-gray-400'}`}>
                  Yearly
                </span>
              </div>
            </div>

            {/* Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {developmentTiers.map((tier) => (
                <Card 
                  key={tier.id}
                  className={`relative transition-all duration-300 hover:shadow-xl ${getCardClass(tier.id)}`}
                  onClick={() => handleTierSelect(tier.id)}
                >
                  {tier.badge && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className={`bg-gradient-to-r ${tier.gradientFrom} ${tier.gradientTo} px-4 py-1 text-white`}>
                        {tier.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={`pb-4 ${tier.badge ? 'pt-8' : 'pt-6'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <Badge 
                        variant="outline" 
                        className={`bg-${tier.color}-500/10 text-${tier.color}-400 border-${tier.color}-500/30`}
                      >
                        {tier.name.toUpperCase()}
                      </Badge>
                      {selectedTier === tier.id && (
                        <Badge className={`bg-${tier.color}-500 text-white`}>Selected</Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-bold">{tier.name} Tier</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    
                    <div className="mt-4">
                      <span className="text-3xl font-bold">
                        ${billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly}
                      </span>
                      <span className="text-gray-400">/{billingCycle}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-3">
                      {tier.features.filter(f => f.included).slice(0, 6).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className={`h-5 w-5 text-${tier.color}-500 mr-2 flex-shrink-0 mt-0.5`} />
                          <span>{feature.name}</span>
                        </li>
                      ))}
                      {tier.features.filter(f => f.included).length > 6 && (
                        <li className="text-sm text-gray-400 italic text-center pt-2">
                          +{tier.features.filter(f => f.included).length - 6} more features
                        </li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className={`w-full ${getButtonClass(tier.id)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTierSelect(tier.id);
                      }}
                    >
                      {selectedTier === tier.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Boot Camp Card - Separate from tiers */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                  Or Choose Our Intensive Boot Camp
                </span>
              </h2>
              <Card 
                className={`relative max-w-lg mx-auto transition-all duration-300 hover:shadow-xl ${getCardClass('bootcamp')}`}
                onClick={handleBootcampSelect}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      ONE-TIME PAYMENT
                    </Badge>
                    {selectedTier === 'bootcamp' && (
                      <Badge className="bg-emerald-500 text-white">Selected</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-bold">VIBE Boot Camp</CardTitle>
                  <CardDescription>Intensive 6-week program with professional trainers</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${bootcampOption.price}</span>
                    <span className="text-gray-400"> one-time</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="space-y-3">
                    {bootcampOption.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${getButtonClass('bootcamp')}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBootcampSelect();
                    }}
                  >
                    {selectedTier === 'bootcamp' ? 'Selected' : 'Select Boot Camp'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Features Comparison Section */}
          <TabsContent value="features" className="mt-4 space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-4 px-6 font-normal text-gray-400">Feature</th>
                    {developmentTiers.map((tier) => (
                      <th key={tier.id} className="py-4 px-6 text-center">
                        <span className={`text-${tier.color}-400 font-bold`}>{tier.name}</span>
                        <div className="text-sm text-gray-400">
                          ${billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly}/{billingCycle}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Combine all features across all tiers */}
                  {developmentTiers[0].features.map((baseFeature, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-4 px-6 flex items-center gap-2">
                        <baseFeature.icon className="h-5 w-5 text-gray-400" />
                        <div>
                          <div>{baseFeature.name}</div>
                          <div className="text-xs text-gray-400">{baseFeature.description}</div>
                        </div>
                      </td>
                      {developmentTiers.map((tier) => {
                        const tierFeature = tier.features[index];
                        return (
                          <td key={tier.id} className="py-4 px-6 text-center">
                            {tierFeature?.included ? (
                              <Badge 
                                variant="outline" 
                                className={getFeatureBadgeClass(tierFeature.highlightLevel)}
                              >
                                <Check className="h-4 w-4 mr-1" /> Included
                              </Badge>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Boot Camp Section */}
          <TabsContent value="bootcamp" className="mt-4 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                  VIBE Boot Camp
                </h2>
                <p className="text-gray-300 mb-6">
                  Our intensive 6-week program takes your coding skills to the next level through 
                  expert guidance, hands-on projects, and personalized feedback.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-emerald-500/20">
                    <h3 className="font-medium text-emerald-400 flex items-center mb-2">
                      <Users className="h-5 w-5 mr-2" />
                      Live Cohort Experience
                    </h3>
                    <p className="text-sm text-gray-300">
                      Join a small group of motivated learners guided by professional tech trainers.
                      Build connections and collaborate on exciting projects.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-emerald-500/20">
                    <h3 className="font-medium text-emerald-400 flex items-center mb-2">
                      <Puzzle className="h-5 w-5 mr-2" />
                      Practical Project-Based Learning
                    </h3>
                    <p className="text-sm text-gray-300">
                      Apply your knowledge through real-world projects. Get personalized feedback
                      and iterate on your work for maximum improvement.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-emerald-500/20">
                    <h3 className="font-medium text-emerald-400 flex items-center mb-2">
                      <Trophy className="h-5 w-5 mr-2" />
                      Certificate & Portfolio Development
                    </h3>
                    <p className="text-sm text-gray-300">
                      Graduate with a certificate of completion and a polished portfolio
                      showcasing your newfound skills to future schools or programs.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button 
                    className={getButtonClass('bootcamp')}
                    onClick={handleBootcampSelect}
                    size="lg"
                  >
                    Select Boot Camp <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-800/30 rounded-xl p-6 border border-emerald-500/20">
                <h3 className="text-xl font-bold mb-4">Boot Camp Schedule</h3>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 w-16 text-emerald-400 font-medium">Week 1-2</div>
                    <div>
                      <div className="font-medium">Foundations & Tools</div>
                      <p className="text-sm text-gray-400">Setting up your environment, coding basics, and AI fundamentals</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-16 text-emerald-400 font-medium">Week 3-4</div>
                    <div>
                      <div className="font-medium">Project Development</div>
                      <p className="text-sm text-gray-400">Building your own AI-powered application with guidance</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-16 text-emerald-400 font-medium">Week 5-6</div>
                    <div>
                      <div className="font-medium">Refinement & Showcase</div>
                      <p className="text-sm text-gray-400">Polishing your project and preparing for the final showcase</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Boot Camp Fee</span>
                    <span className="font-medium">${bootcampOption.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Included Premium Subscription</span>
                    <span className="font-medium">3 months</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Upcoming Cohort Start Date</span>
                    <span className="font-medium">June 15, 2025</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Limited Seats</span>
                    <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                      Only 10 spots left
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Checkout Button */}
        <div className="flex flex-col items-center justify-center mt-12 mb-16">
          <div className="text-center mb-6">
            {selectedTier && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-lg mb-2">
                  You selected: <span className="font-bold text-blue-400">
                    {selectedTier === 'bootcamp' 
                      ? 'VIBE Boot Camp' 
                      : `${developmentTiers.find(t => t.id === selectedTier)?.name} Tier`}
                  </span>
                </div>
                <div className="text-gray-400">
                  {selectedTier === 'bootcamp' 
                    ? `One-time payment of $${bootcampOption.price}` 
                    : `${billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)} billing at $${
                        billingCycle === 'monthly' 
                          ? developmentTiers.find(t => t.id === selectedTier)?.priceMonthly 
                          : developmentTiers.find(t => t.id === selectedTier)?.priceYearly
                      }/${billingCycle}`}
                </div>
              </motion.div>
            )}
          </div>
          
          <Button 
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-6 text-xl rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl"
            onClick={handleProceedToCheckout}
            disabled={!selectedTier || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Checkout
                <ChevronRight className="ml-2 h-6 w-6" />
              </>
            )}
          </Button>
          
          <div className="mt-4 text-gray-400 text-sm flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Secure checkout with Stripe. No payment information is stored on our servers.
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose NURD Development?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-blue-500/20 p-3 rounded-full mb-4">
                <Sparkles className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Learning</h3>
              <p className="text-gray-400 text-sm">Learn with cutting-edge AI that adapts to your skill level</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-purple-500/20 p-3 rounded-full mb-4">
                <BookOpen className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Structured Curriculum</h3>
              <p className="text-gray-400 text-sm">Follow a clear learning path designed by education experts</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-green-500/20 p-3 rounded-full mb-4">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Community Support</h3>
              <p className="text-gray-400 text-sm">Join a vibrant community of young learners and mentors</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-amber-500/20 p-3 rounded-full mb-4">
                <Globe className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="font-semibold mb-2">Real-World Skills</h3>
              <p className="text-gray-400 text-sm">Gain practical coding skills relevant in today's digital world</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-lg mb-2">Can I switch between tiers later?</h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your subscription tier at any time. 
                When upgrading, you'll receive immediate access to all new features.
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-lg mb-2">Do you offer family plans?</h3>
              <p className="text-gray-400">
                Yes! We offer family plans allowing up to 5 family members to access NURD.
                Contact our support team for special family pricing options.
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-lg mb-2">What's the refund policy?</h3>
              <p className="text-gray-400">
                We offer a 14-day money-back guarantee on all subscription plans. 
                If you're not satisfied, contact us within 14 days for a full refund.
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-lg mb-2">Is there an age requirement?</h3>
              <p className="text-gray-400">
                NURD is designed for young learners aged 10-18, although we welcome 
                learners of all ages. For users under 13, parent/guardian consent is required.
              </p>
            </div>
          </div>
        </div>

        {/* Return to Subscription Plans */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white"
            onClick={() => navigate('/subscription-plans')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Basic Plans
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedCheckout;