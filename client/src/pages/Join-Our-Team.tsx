import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Check, 
  ArrowRight, 
  Users, 
  Code, 
  Sparkles, 
  Laptop, 
  Rocket, 
  Calendar,
  Medal,
  Star,
  ChevronsRight,
  Briefcase,
  Atom
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JoinOurTeam: React.FC = () => {
  const { toast } = useToast();

  // Function to scroll to application form
  const scrollToApplicationForm = () => {
    const formElement = document.getElementById('application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus on first input after scrolling
      setTimeout(() => {
        const firstInput = document.getElementById('firstName');
        if (firstInput) firstInput.focus();
      }, 800);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "Thanks for your interest in joining our team! We'll be in touch soon.",
    });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const platforms = [
    { name: "Vercel", category: "Cloud" },
    { name: "Netlify", category: "Cloud" },
    { name: "Railway", category: "Cloud" },
    { name: "Render", category: "Cloud" },
    { name: "Fly.io", category: "Cloud" },
    { name: "AWS Amplify", category: "Cloud" },
    { name: "Firebase", category: "Cloud" },
    { name: "Google Agentspace", category: "Cloud" },
    { name: "Cloudflare Pages", category: "Cloud" },
    { name: "Replit", category: "Cloud" },
    { name: "Heroku", category: "Local & Hybrid" },
    { name: "DigitalOcean", category: "Local & Hybrid" },
    { name: "Docker", category: "Local & Hybrid" },
    { name: "Kubernetes", category: "Local & Hybrid" },
    { name: "Deno Deploy", category: "Local & Hybrid" },
    { name: "CapRover", category: "Local & Hybrid" },
    { name: "Cursor", category: "Emerging" },
    { name: "Lovable", category: "Emerging" },
    { name: "Bolt", category: "Emerging" },
    { name: "n8n", category: "Emerging" },
    { name: "gumloop", category: "Emerging" },
    { name: "Mindstudio", category: "Emerging" }
  ];

  return (
    <div className="min-h-screen flex flex-col pt-16">
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 relative bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
        <div className="absolute inset-0 bg-grid-white/5 mask-gradient-b" />
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Shape the Future.<br />Join Our Training Team.</h1>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              We're looking for experienced IT professionals who are passionate about mentoring the next generation of tech innovators.
            </p>
            <Button 
              className="bg-[#3DE053] hover:bg-[#32bd45] text-black font-medium px-8 py-6 text-lg"
              onClick={scrollToApplicationForm}
            >
              Apply Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-black via-orange-500 to-amber-400">Modern Platform Expertise Meets Young Minds</h2>
              <p className="text-xl text-gray-600">
                At NURD, we're bridging the gap between cutting-edge technology and young innovators. Our trainers are the catalyst for this transformation.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              <motion.div variants={item} className="bg-gray-50 rounded-xl p-8 shadow-sm">
                <div className="bg-[#3DE053]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Rocket className="h-8 w-8 text-[#3DE053]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Build on Modern Platforms</h3>
                <p className="text-gray-600">
                  Apply your expertise with today's leading deployment platforms to guide students in building real-world applications.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="bg-gray-50 rounded-xl p-8 shadow-sm">
                <div className="bg-[#6A2FF8]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="h-8 w-8 text-[#6A2FF8]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Flexible Teaching Model</h3>
                <p className="text-gray-600">
                  Lead workshops virtually or in-person with our hybrid teaching approach. Set your own schedule and teaching style.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="bg-gray-50 rounded-xl p-8 shadow-sm">
                <div className="bg-[#3EC6E0]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-[#3EC6E0]" />
                </div>
                <h3 className="text-xl font-bold mb-4">Impact Young Developers</h3>
                <p className="text-gray-600">
                  Inspire the next generation of innovators by sharing your real-world experience and technical knowledge.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Platform Expertise Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Platform Expertise Matters</h2>
              <p className="text-xl text-gray-600">
                We leverage a wide range of modern deployment platforms to give our students real-world experience. If you've worked with any of these tools, we want to hear from you.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="mb-16"
            >
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {platforms.map((platform, index) => (
                  <motion.span
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center
                      ${platform.category === 'Cloud' ? 'bg-blue-100 text-blue-800' : 
                      platform.category === 'Local & Hybrid' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'}`}
                  >
                    {platform.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              <motion.div variants={item} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Atom className="mr-3 text-[#6A2FF8]" />
                  Cloud Platforms
                </h3>
                <p className="text-gray-600 mb-4">
                  From Vercel and Netlify to Firebase and Replit, we cover the most popular cloud deployment platforms for web and mobile applications.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    Next.js, React, and JAMstack deployments
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    Serverless functions and edge computing
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    Full-stack environments for collaborative learning
                  </li>
                </ul>
              </motion.div>
              
              <motion.div variants={item} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Laptop className="mr-3 text-[#3EC6E0]" />
                  Emerging Technologies
                </h3>
                <p className="text-gray-600 mb-4">
                  We stay on the cutting edge with platforms like Google Agentspace, Mindstudio, and other tools reshaping the deployment landscape.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    AI-enhanced development workflows
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    No-code/low-code development platforms
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-green-500" />
                    Containerization and orchestration tools
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Why Join Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Why Join Our Training Team?</h2>
              <p className="text-xl text-gray-600">
                Beyond sharing your expertise, being a NURD trainer offers unique opportunities for your professional growth.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <motion.div variants={item} className="text-center">
                <div className="bg-[#3DE053]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Calendar className="h-7 w-7 text-[#3DE053]" />
                </div>
                <h3 className="text-lg font-bold mb-2">Flexible Schedule</h3>
                <p className="text-gray-600">
                  Choose when and how you teach. Lead workshops part-time while maintaining your freelance career.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="text-center">
                <div className="bg-[#6A2FF8]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Medal className="h-7 w-7 text-[#6A2FF8]" />
                </div>
                <h3 className="text-lg font-bold mb-2">Competitive Compensation</h3>
                <p className="text-gray-600">
                  Earn competitive rates for workshops, with bonuses for student achievements and project completions.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="text-center">
                <div className="bg-[#FF8A00]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Star className="h-7 w-7 text-[#FF8A00]" />
                </div>
                <h3 className="text-lg font-bold mb-2">Community Recognition</h3>
                <p className="text-gray-600">
                  Build your profile as an industry expert and expand your professional network within the tech community.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="text-center">
                <div className="bg-[#3EC6E0]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Briefcase className="h-7 w-7 text-[#3EC6E0]" />
                </div>
                <h3 className="text-lg font-bold mb-2">Project Opportunities</h3>
                <p className="text-gray-600">
                  Access exclusive freelance projects through our network of partner companies and organizations.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Ideal Candidate Section */}
        <section className="py-20 bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Ideal NURD Trainer</h2>
              <p className="text-xl opacity-90">
                We're looking for tech professionals who combine technical expertise with a passion for teaching.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto"
            >
              <motion.div variants={item} className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-xl font-bold mb-6 text-[#3DE053]">What You'll Bring</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3DE053] mt-0.5 flex-shrink-0" />
                    <span>2+ years of experience with modern web or mobile development</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3DE053] mt-0.5 flex-shrink-0" />
                    <span>Hands-on expertise with at least 3 deployment platforms from our list</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3DE053] mt-0.5 flex-shrink-0" />
                    <span>Strong communication skills and ability to explain complex concepts simply</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3DE053] mt-0.5 flex-shrink-0" />
                    <span>Passion for mentoring and a patient, approachable teaching style</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3DE053] mt-0.5 flex-shrink-0" />
                    <span>Ability to create engaging, hands-on coding exercises and projects</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div variants={item} className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-xl font-bold mb-6 text-[#3EC6E0]">What You'll Do</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3EC6E0] mt-0.5 flex-shrink-0" />
                    <span>Lead workshops and sessions on modern deployment platforms and techniques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3EC6E0] mt-0.5 flex-shrink-0" />
                    <span>Guide students in building and deploying their projects from concept to launch</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3EC6E0] mt-0.5 flex-shrink-0" />
                    <span>Provide code reviews and constructive feedback on student projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3EC6E0] mt-0.5 flex-shrink-0" />
                    <span>Contribute to our growing library of learning resources and project templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronsRight className="h-5 w-5 text-[#3EC6E0] mt-0.5 flex-shrink-0" />
                    <span>Connect students with real-world opportunities to showcase their skills</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Apply Section */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to Join Our Team?</h2>
              <p className="text-lg text-gray-600">
                Apply now to become a NURD trainer and help shape the next generation of tech innovators.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto"
            >
              <form id="application-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <Input id="firstName" placeholder="Your first name" required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <Input id="lastName" placeholder="Your last name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <Input id="experience" type="number" min="1" placeholder="2" required />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="platforms" className="block text-sm font-medium text-gray-700 mb-1">Platforms You're Familiar With</label>
                  <Input id="platforms" placeholder="e.g. Vercel, Firebase, Replit" required />
                  <p className="mt-1 text-xs text-gray-500">Please list the platforms you have experience with, separated by commas.</p>
                </div>
                
                <div className="mb-5">
                  <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">Portfolio or LinkedIn URL</label>
                  <Input id="portfolio" type="url" placeholder="https://" required />
                </div>
                
                <div className="mb-5">
                  <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">Why do you want to join our team?</label>
                  <Textarea id="motivation" placeholder="Tell us why you're interested in becoming a NURD trainer" className="min-h-[100px]" required />
                </div>
                
                <Button type="submit" className="w-full bg-[#3DE053] hover:bg-[#32bd45] text-black font-medium py-2">
                  Submit Application
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      

    </div>
  );
};

export default JoinOurTeam;