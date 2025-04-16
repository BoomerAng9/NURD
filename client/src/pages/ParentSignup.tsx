import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import MetaData from '@/components/seo/meta-data';
import { Users2, Star, HelpCircle, CheckCheck } from 'lucide-react';

// Form validation schema
const signUpFormSchema = z.object({
  parentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  parentEmail: z.string().email({ message: "Please enter a valid email address." }),
  parentPhone: z.string().min(10, { message: "Please enter a valid phone number." }),
  childName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  childAge: z.string().min(1, { message: "Please select your child's age." }),
  currentSkills: z.string().optional(),
  interestAreas: z.string().min(1, { message: "Please select at least one area of interest." }),
  additionalInfo: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms to continue.",
  }),
  agreeToUpdates: z.boolean().optional(),
});

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
    }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

const ParentSignup: React.FC = () => {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // SEO metadata
  const seoTitle = "Sign Up - NURD Achievers Program | Technology Education for Children";
  const seoDescription = "Register your child for our NURD Achievers Program with personalized learning paths, digital badges, and STEAM education designed for tomorrow's innovators.";
  const seoKeywords = "NURD sign up, technology education for children, STEAM learning, coding for kids, youth coding initiatives";

  // Form setup
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      childName: "",
      childAge: "",
      currentSkills: "",
      interestAreas: "",
      additionalInfo: "",
      agreeToTerms: false,
      agreeToUpdates: false,
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log('Form submitted:', data);
    
    // Show success toast
    toast({
      title: "Sign up successful!",
      description: "Thank you for registering your child for the NURD Achievers Program.",
    });
    
    // Show confirmation modal
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MetaData 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical="/parent-signup"
      />
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Sign Up Section */}
        <section className="py-16 bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-4">Sign Up for the NURD Achievers Program</h1>
              <p className="text-xl opacity-90 mb-6">
                Register your child for our <span className="font-medium">technology education for children</span> program. 
                We'll create a custom <span className="font-medium">interactive profile card</span> and provide access to 
                <span className="font-medium"> youth coding initiatives</span> that foster creativity and innovation.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <Users2 className="mr-2 h-5 w-5 text-[#3DE053]" />
                      Parent Details
                    </h2>
                    <Separator className="bg-white/20 mb-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="parentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="parentPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent Phone</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(XXX) XXX-XXXX" 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="parentEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent Email</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center space-x-2">
                                    <FormControl>
                                      <Input 
                                        type="email" 
                                        placeholder="your.email@example.com" 
                                        {...field} 
                                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                                      />
                                    </FormControl>
                                    <HelpCircle className="h-4 w-4 text-gray-400" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>We'll use this email to send program updates and login details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      <Star className="mr-2 h-5 w-5 text-[#3DE053]" />
                      Child Details
                    </h2>
                    <Separator className="bg-white/20 mb-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="childName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Child's Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Child's full name" 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="childAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Child's Age</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Select age range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="6-8">6-8 years</SelectItem>
                                <SelectItem value="9-11">9-11 years</SelectItem>
                                <SelectItem value="12-14">12-14 years</SelectItem>
                                <SelectItem value="15-17">15-17 years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="currentSkills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Tech Skills (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Select skill level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner - No previous experience</SelectItem>
                                <SelectItem value="novice">Novice - Basic understanding</SelectItem>
                                <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                                <SelectItem value="advanced">Advanced - Experienced coder</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-gray-400 text-xs">
                              This helps us tailor the learning experience
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="interestAreas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Areas of Interest</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Select primary interest" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="webdev">Web Development</SelectItem>
                                <SelectItem value="gamedev">Game Development</SelectItem>
                                <SelectItem value="appdev">App Development</SelectItem>
                                <SelectItem value="robotics">Robotics & Electronics</SelectItem>
                                <SelectItem value="animation">Animation & 3D Modeling</SelectItem>
                                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Information (Optional)</FormLabel>
                            <FormControl>
                              <textarea 
                                {...field} 
                                placeholder="Any special requirements, interests, or questions?" 
                                className="w-full h-24 rounded-md p-3 bg-white/5 border border-white/10 text-white placeholder:text-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4 mt-1 rounded border-white/30 bg-white/5"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the <a href="#" className="text-blue-300 hover:underline">terms and conditions</a>, <a href="#" className="text-blue-300 hover:underline">privacy policy</a>, and <a href="#" className="text-blue-300 hover:underline">child safety guidelines</a>.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="agreeToUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4 mt-1 rounded border-white/30 bg-white/5"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I would like to receive updates about NURD programs and events.
                            </FormLabel>
                            <FormDescription className="text-xs text-gray-400">
                              For important program updates and notifications.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-bold bg-gradient-to-r from-[#3DE053] to-[#3EC6E0] hover:from-[#6A2FF8] hover:to-[#3DE053] border-none"
                  >
                    Register For The NURD Achievers Program
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </section>
        
        {/* What Makes an ACHIEVER */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#3DE053] via-[#6A2FF8] to-[#3EC6E0]">
                What Makes an ACHIEVER
              </h2>
              <p className="text-lg text-gray-600">
                The NURD Initiative empowers young minds through our <span className="font-medium text-gray-700">technology education for children</span> programs. 
                We blend <span className="font-medium text-gray-700">STEAM learning</span> with <span className="font-medium text-gray-700">creative coding</span> to 
                nurture the <span className="font-medium text-gray-700">future innovators</span> of tomorrow.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              <motion.div 
                variants={item} 
                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Digital Badge System</h3>
                <p className="text-gray-600">
                  Earn <span className="font-medium">virtual achievement cards</span> and digital badges as you complete 
                  our <span className="font-medium">coding for kids</span> modules and demonstrate new tech skills.
                </p>
              </motion.div>
              
              <motion.div 
                variants={item} 
                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">STEAM Learning Programs</h3>
                <p className="text-gray-600">
                  Experience our <span className="font-medium">gamified learning experience</span> with personalized paths 
                  and age-appropriate <span className="font-medium">technology education for children</span>.
                </p>
              </motion.div>
              
              <motion.div 
                variants={item} 
                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Future Innovators</h3>
                <p className="text-gray-600">
                  Our <span className="font-medium">creative coding for youth</span> approach nurtures 
                  <span className="font-medium"> next-gen digital learning</span> skills through interactive 
                  <span className="font-medium"> kid-friendly coding camps</span>.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Program Timeline */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">NURD Journey</h2>
              <p className="text-lg text-gray-600">
                What to expect after enrolling your child in the NURD Achievers Program
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="relative"
              >
                {/* Timeline line */}
                <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-1 bg-primary/30 transform md:translate-x-[-50%]"></div>
                
                {/* Timeline steps */}
                <div className="space-y-12">
                  <motion.div variants={item} className="relative flex flex-col md:flex-row md:items-center">
                    <div className="flex-1 md:text-right md:pr-8 md:pb-0 pb-8 order-2 md:order-1">
                      <h3 className="text-xl font-bold mb-2">Registration</h3>
                      <p className="text-gray-600">Complete the sign-up form with parent and child information.</p>
                    </div>
                    <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-center absolute left-0 md:left-1/2 transform md:translate-x-[-50%] order-1 md:order-2">
                      <span>1</span>
                    </div>
                    <div className="flex-1 md:pl-8 order-3"></div>
                  </motion.div>
                  
                  <motion.div variants={item} className="relative flex flex-col md:flex-row md:items-center">
                    <div className="flex-1 md:text-right md:pr-8 md:order-1 hidden md:block"></div>
                    <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-center absolute left-0 md:left-1/2 transform md:translate-x-[-50%] order-1 md:order-2">
                      <span>2</span>
                    </div>
                    <div className="flex-1 md:pl-8 pb-8 md:pb-0 order-2 md:order-3">
                      <h3 className="text-xl font-bold mb-2">Welcome Pack</h3>
                      <p className="text-gray-600">Receive a confirmation email with a digital welcome pack and login details.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={item} className="relative flex flex-col md:flex-row md:items-center">
                    <div className="flex-1 md:text-right md:pr-8 md:pb-0 pb-8 order-2 md:order-1">
                      <h3 className="text-xl font-bold mb-2">Orientation Session</h3>
                      <p className="text-gray-600">Schedule an optional online orientation to learn about the platform.</p>
                    </div>
                    <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-center absolute left-0 md:left-1/2 transform md:translate-x-[-50%] order-1 md:order-2">
                      <span>3</span>
                    </div>
                    <div className="flex-1 md:pl-8 order-3"></div>
                  </motion.div>
                  
                  <motion.div variants={item} className="relative flex flex-col md:flex-row md:items-center">
                    <div className="flex-1 md:text-right md:pr-8 md:order-1 hidden md:block"></div>
                    <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-center absolute left-0 md:left-1/2 transform md:translate-x-[-50%] order-1 md:order-2">
                      <span>4</span>
                    </div>
                    <div className="flex-1 md:pl-8 order-2 md:order-3">
                      <h3 className="text-xl font-bold mb-2">Start Learning!</h3>
                      <p className="text-gray-600">Access personalized learning modules and begin your NURD journey!</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Confirmation Modal */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl flex items-center justify-center">
                <CheckCheck className="h-6 w-6 text-green-500 mr-2" />
                Welcome to the NURD Achievers Program!
              </DialogTitle>
              <DialogDescription className="text-center pt-4">
                Thank you for registering your child for the NURD Achievers Program!
              </DialogDescription>
            </DialogHeader>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 my-4">
              <h3 className="font-semibold mb-2 text-gray-900">Next Steps:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <p>A confirmation email will be sent to you with detailed instructions for getting started.</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <p>Your child's custom NURD profile card will be generated shortly and sent to your email.</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <p>Stay tuned for progress updates and activities.</p>
                </li>
              </ul>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button
                type="button"
                className="bg-primary text-white"
                onClick={() => setShowConfirmation(false)}
              >
                Got it, thanks!
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default ParentSignup;