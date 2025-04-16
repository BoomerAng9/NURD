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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { Star, CheckCheck, Award, Users2, HelpCircle, Calendar, } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import MetaData from '@/components/seo/meta-data';

// Validation schema with error messages
const signUpFormSchema = z.object({
  parentName: z.string().min(2, {
    message: "Parent name must be at least 2 characters.",
  }),
  parentEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  parentPhone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  childName: z.string().min(2, {
    message: "Child name must be at least 2 characters.",
  }),
  childAge: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Age must be a valid number.",
  }),
  childGrade: z.string({
    required_error: "Please select a grade level.",
  }),
  programType: z.string({
    required_error: "Please select a program type.",
  }),
  newsletter: z.boolean().default(false).optional(),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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

// SEO content
const seoTitle = "ACHIEVER Sign Up | NURD Initiative";
const seoDescription = "Register your child for the NURD Initiative - our innovative technology education program for children that fosters creativity and digital skills.";
const seoKeywords = "NURD Initiative, sign up, register, ACHIEVER, children tech education, coding for kids, STEAM learning, youth technology";

const AchieverSignUp: React.FC = () => {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Initialize the form
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      childName: "",
      childAge: "",
      childGrade: "elementary",
      programType: "summer",
      newsletter: true,
    },
  });
  
  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
    toast({
      title: "Registration submitted!",
      description: "Thank you for registering for the NURD Initiative.",
    });
    setShowConfirmation(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <MetaData 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical="/achiever-signup"
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
              <h1 className="text-4xl font-bold mb-4">Sign Up for the NURD Initiative</h1>
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
                            <FormLabel>Parent/Guardian Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Full Name" 
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
                                placeholder="Child's Full Name" 
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
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Age" 
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
                        name="childGrade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Select grade level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="preschool">Preschool</SelectItem>
                                <SelectItem value="elementary">Elementary School (K-5)</SelectItem>
                                <SelectItem value="middle">Middle School (6-8)</SelectItem>
                                <SelectItem value="high">High School (9-12)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="programType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Program Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                  <SelectValue placeholder="Select program" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="summer">Summer Initiative</SelectItem>
                                <SelectItem value="weekend">Weekend Workshops</SelectItem>
                                <SelectItem value="afterschool">After-School Program</SelectItem>
                                <SelectItem value="camp">Holiday Camp</SelectItem>
                              </SelectContent>
                            </Select>
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
                                type="tel" 
                                placeholder="(123) 456-7890" 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="newsletter"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-[#3DE053] data-[state=checked]:text-primary-foreground"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Sign up for our newsletter
                                </FormLabel>
                                <FormDescription className="text-gray-300 text-sm">
                                  For important program updates and notifications.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#3DE053] to-[#2BF3C0] text-gray-900 font-medium py-6 rounded-lg hover:opacity-90 transition"
                    >
                      Register Your Child
                    </Button>
                  </div>
                </form>
              </Form>
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
                What to expect after enrolling your child in the NURD Initiative
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
                Welcome to the NURD Initiative!
              </DialogTitle>
              <DialogDescription className="text-center pt-4">
                Thank you for registering your child for the NURD Initiative!
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
                  <p>Visit the ACHIEVERS tab for progress updates and activities.</p>
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

export default AchieverSignUp;