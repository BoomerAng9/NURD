import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Define the form schema for parent and student information
const formSchema = z.object({
  parentFirstName: z.string().min(2, "First name must be at least 2 characters"),
  parentLastName: z.string().min(2, "Last name must be at least 2 characters"),
  parentEmail: z.string().email("Please enter a valid email address"),
  parentPhone: z.string().min(10, "Please enter a valid phone number"),
  studentFirstName: z.string().min(2, "First name must be at least 2 characters"),
  studentLastName: z.string().min(2, "Last name must be at least 2 characters"),
  studentAge: z.string().min(1, "Please enter the student's age"),
  grade: z.string().min(1, "Please select the student's grade"),
  school: z.string().min(1, "Please enter the student's school"),
  programTier: z.enum(["basic", "plus", "premium"]),
  interests: z.array(z.string()).nonempty("Please select at least one interest"),
  experience: z.enum(["none", "beginner", "intermediate", "advanced"]),
  additionalInfo: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

const Achievers = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Use URL search parameters to determine active tab
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === "signup" ? "signup" : "about");

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentFirstName: "",
      parentLastName: "",
      parentEmail: "",
      parentPhone: "",
      studentFirstName: "",
      studentLastName: "",
      studentAge: "",
      grade: "",
      school: "",
      programTier: "basic",
      interests: [],
      experience: "none",
      additionalInfo: "",
      acceptTerms: false,
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real application, we would send this data to a server
    console.log(values);
    
    // Show success message
    toast({
      title: "Registration Submitted!",
      description: "Thank you for registering for the ACHIEVERS program. We'll be in touch soon!",
    });
    
    // Reset the form
    form.reset();
  };

  // Array of program benefits by tier
  const programTiers = {
    basic: {
      title: "ACHIEVER Basic",
      price: "$199/month",
      features: [
        "Weekly coding workshops (2 hours)",
        "Access to learning platform",
        "Monthly progress reports",
        "Community forum access",
      ],
    },
    plus: {
      title: "ACHIEVER Plus",
      price: "$299/month",
      features: [
        "All Basic features",
        "Twice weekly workshops (4 hours total)",
        "1-on-1 mentoring session (monthly)",
        "Advanced project opportunities",
        "Personalized learning path",
      ],
    },
    premium: {
      title: "ACHIEVER Premium",
      price: "$499/month",
      features: [
        "All Plus features",
        "Three weekly workshops (6 hours total)",
        "Weekly 1-on-1 mentoring",
        "Industry connection opportunities",
        "College application support",
        "Internship placement assistance",
        "Exclusive hackathon participation",
      ],
    },
  };

  // Array of program interests
  const interestOptions = [
    { id: "web-dev", label: "Web Development" },
    { id: "mobile-apps", label: "Mobile Apps" },
    { id: "game-dev", label: "Game Development" },
    { id: "ai-ml", label: "AI & Machine Learning" },
    { id: "robotics", label: "Robotics" },
    { id: "digital-art", label: "Digital Art & Design" },
    { id: "cybersecurity", label: "Cybersecurity" },
    { id: "data-science", label: "Data Science" },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-600 mb-4">
          ACHIEVERS Program
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          Empowering the next generation of tech leaders through creative coding, AI collaboration, and community innovation.
        </p>
      </motion.div>

      <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-4xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="tiers">Program Tiers</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What Makes an <span className="text-primary font-bold">ACHIEVER</span>?</CardTitle>
              <CardDescription>
                Our vision for the future tech leaders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Our Approach</h3>
                  <p>
                    The ACHIEVERS program is built on the belief that every young person has the potential to create, innovate, and solve the world's problems through technology. We combine technical skills with creative thinking and ethical principles.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">1</div>
                      <p><span className="font-semibold">Creative Problem Solving</span> - Tackling challenges with innovative thinking</p>
                    </div>
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">2</div>
                      <p><span className="font-semibold">Ethical Technology</span> - Building with purpose and responsibility</p>
                    </div>
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">3</div>
                      <p><span className="font-semibold">Community Collaboration</span> - Working together to amplify impact</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Program Structure</h3>
                  <p>
                    Each ACHIEVER is guided through a personalized learning journey that combines structured workshops, hands-on projects, and mentorship from industry professionals.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><span className="font-semibold">Weekly Workshops</span>: Interactive coding sessions with expert instructors</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><span className="font-semibold">Project-Based Learning</span>: Build a portfolio of meaningful tech projects</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><span className="font-semibold">Mentorship</span>: One-on-one guidance from industry professionals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span><span className="font-semibold">Community Events</span>: Hackathons, showcases, and networking opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Student Achievements</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                    <h4 className="font-medium text-green-800 dark:text-green-400">Project Showcase</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">90% of students complete at least one major project</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                    <h4 className="font-medium text-blue-800 dark:text-blue-400">Knowledge Growth</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Average skill level increases 3x in first 6 months</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                    <h4 className="font-medium text-purple-800 dark:text-purple-400">Competition Success</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">ACHIEVERS win 40% of hackathons entered</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => setActiveTab("signup")}>
                Ready to Join? Sign Up Now
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="tiers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Program Tiers</CardTitle>
              <CardDescription>
                Choose the program that fits your student's goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(programTiers).map(([key, tier]) => (
                  <div 
                    key={key}
                    className={`border rounded-xl overflow-hidden transition-all ${
                      key === 'premium' 
                        ? 'shadow-lg ring-2 ring-primary/50 transform md:scale-105' 
                        : 'shadow hover:shadow-md'
                    }`}
                  >
                    <div className={`p-5 ${
                      key === 'basic' 
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' 
                        : key === 'plus'
                          ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
                          : 'bg-gradient-to-br from-primary/10 to-blue-400/10'
                    }`}>
                      <h3 className="text-xl font-bold">{tier.title}</h3>
                      <div className="mt-2 mb-4">
                        <span className="text-2xl font-bold">{tier.price}</span>
                      </div>
                      {key === 'premium' && (
                        <Badge className="bg-primary">Most Popular</Badge>
                      )}
                    </div>
                    <div className="p-5">
                      <ul className="space-y-3">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary mr-2 flex-shrink-0">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full mt-6 ${
                          key === 'premium' ? '' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => {
                          setActiveTab("signup");
                          form.setValue("programTier", key as "basic" | "plus" | "premium");
                        }}
                      >
                        Select This Tier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="signup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">ACHIEVER Registration</CardTitle>
              <CardDescription>
                Register your child for the ACHIEVERS program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="border-b pb-2 mb-4">
                        <h3 className="font-semibold text-lg">Parent/Guardian Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="parentFirstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="First name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="parentLastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="parentEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="yourname@example.com" {...field} />
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <div className="border-b pb-2 mb-4">
                        <h3 className="font-semibold text-lg">Student Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="studentFirstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="First name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="studentLastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="studentAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl>
                                <Input placeholder="Age" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="grade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Grade</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select grade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="K">Kindergarten</SelectItem>
                                  <SelectItem value="1">1st Grade</SelectItem>
                                  <SelectItem value="2">2nd Grade</SelectItem>
                                  <SelectItem value="3">3rd Grade</SelectItem>
                                  <SelectItem value="4">4th Grade</SelectItem>
                                  <SelectItem value="5">5th Grade</SelectItem>
                                  <SelectItem value="6">6th Grade</SelectItem>
                                  <SelectItem value="7">7th Grade</SelectItem>
                                  <SelectItem value="8">8th Grade</SelectItem>
                                  <SelectItem value="9">9th Grade</SelectItem>
                                  <SelectItem value="10">10th Grade</SelectItem>
                                  <SelectItem value="11">11th Grade</SelectItem>
                                  <SelectItem value="12">12th Grade</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="school"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School</FormLabel>
                            <FormControl>
                              <Input placeholder="School name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-b pb-2 mb-4">
                      <h3 className="font-semibold text-lg">Program Selection & Student Information</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="programTier"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Program Tier</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="basic" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  ACHIEVER Basic - $199/month
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="plus" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  ACHIEVER Plus - $299/month
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="premium" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  ACHIEVER Premium - $499/month <Badge className="ml-2 bg-primary">Popular</Badge>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interests"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Areas of Interest</FormLabel>
                            <FormDescription>
                              Select all that apply to your student
                            </FormDescription>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2">
                            {interestOptions.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="interests"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prior Coding Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="beginner">Beginner (some exposure)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (completed courses)</SelectItem>
                              <SelectItem value="advanced">Advanced (built projects)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional information, special needs, or requirements we should know about"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the terms and conditions
                            </FormLabel>
                            <FormDescription>
                              By checking this box, you agree to our <Link href="/privacy-policy" className="underline text-primary">Privacy Policy</Link> and <Link href="/terms" className="underline text-primary">Terms of Service</Link>.
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Submit Registration
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievers;