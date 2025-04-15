import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 relative bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6A2FF8]/10 to-transparent opacity-30" />
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="glass-card backdrop-blur-md p-8 rounded-xl border border-white/20 bg-white/5">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#3DE053] to-white">Shape the Future.<br />Join Our Training Team.</h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                We're looking for experienced IT professionals who are passionate about mentoring the next generation of tech innovators.
              </p>
              <Button className="bg-[#3DE053] hover:bg-[#32bd45] text-black font-medium px-8 py-6 text-lg">
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-br from-[#080c24] to-[#161c42]">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Modern Platform Expertise Meets Young Minds</h2>
              <p className="text-xl text-gray-300">
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
              <motion.div variants={item} className="glass-card backdrop-blur-md bg-white/10 p-8 rounded-xl border border-white/20">
                <div className="bg-[#3DE053]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Rocket className="h-8 w-8 text-[#3DE053]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Build on Modern Platforms</h3>
                <p className="text-gray-300">
                  Apply your expertise with today's leading deployment platforms to guide students in building real-world applications.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="glass-card backdrop-blur-md bg-white/10 p-8 rounded-xl border border-white/20">
                <div className="bg-[#6A2FF8]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="h-8 w-8 text-[#6A2FF8]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Flexible Teaching Model</h3>
                <p className="text-gray-300">
                  Lead workshops virtually or in-person with our hybrid teaching approach. Set your own schedule and teaching style.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="glass-card backdrop-blur-md bg-white/10 p-8 rounded-xl border border-white/20">
                <div className="bg-[#3EC6E0]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-[#3EC6E0]" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Impact Young Developers</h3>
                <p className="text-gray-300">
                  Inspire the next generation of innovators by sharing your real-world experience and technical knowledge.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Platform Expertise Section */}
        <section className="py-20 bg-gradient-to-br from-[#161c42] to-[#080c24]">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Your Platform Expertise Matters</h2>
              <p className="text-xl text-gray-300">
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
                    className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center backdrop-blur-md
                      ${platform.category === 'Cloud' ? 'bg-blue-500/20 text-blue-200 border border-blue-500/30' : 
                      platform.category === 'Local & Hybrid' ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30' :
                      'bg-green-500/20 text-green-200 border border-green-500/30'}`}
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
              <motion.div variants={item} className="glass-card bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20">
                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                  <Atom className="mr-3 text-[#6A2FF8]" />
                  Cloud Platforms
                </h3>
                <p className="text-gray-300 mb-4">
                  From Vercel and Netlify to Firebase and Replit, we cover the most popular cloud deployment platforms for web and mobile applications.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="h-5 w-5 text-[#3DE053]" />
                    Next.js, React, and JAMstack deployments
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="h-5 w-5 text-[#3DE053]" />
                    Serverless functions and edge computing
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="h-5 w-5 text-[#3DE053]" />
                    Full-stack environments for collaborative learning
                  </li>
                </ul>
              </motion.div>
              
              <motion.div variants={item} className="glass-card bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20">
                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                  <Laptop className="mr-3 text-[#3EC6E0]" />
                  Emerging Technologies
                </h3>
                <p className="text-gray-300 mb-4">
                  We stay on the cutting edge with platforms like Google Agentspace, Mindstudio, and other tools reshaping the deployment landscape.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="h-5 w-5 text-[#3DE053]" />
                    AI-enhanced development workflows
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="h-5 w-5 text-[#3DE053]" />
                    No-code/low-code development platforms
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="h-5 w-5 text-[#3DE053]" />
                    Containerization and orchestration tools
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Why Join Section */}
        <section className="py-20 bg-gradient-to-br from-[#080c24] to-[#161c42]">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Why Join Our Training Team?</h2>
              <p className="text-xl text-gray-300">
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
              <motion.div variants={item} className="text-center glass-card backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20">
                <div className="bg-[#3DE053]/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Calendar className="h-7 w-7 text-[#3DE053]" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Flexible Schedule</h3>
                <p className="text-gray-300">
                  Choose when and how you teach. Lead workshops part-time while maintaining your freelance career.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="text-center glass-card backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20">
                <div className="bg-[#6A2FF8]/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Medal className="h-7 w-7 text-[#6A2FF8]" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Competitive Compensation</h3>
                <p className="text-gray-300">
                  Earn competitive rates for workshops, with bonuses for student achievements and project completions.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="text-center glass-card backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20">
                <div className="bg-[#FF8A00]/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Star className="h-7 w-7 text-[#FF8A00]" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Community Recognition</h3>
                <p className="text-gray-300">
                  Build your profile as an industry expert and expand your professional network within the tech community.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="text-center glass-card backdrop-blur-md bg-white/10 p-6 rounded-xl border border-white/20">
                <div className="bg-[#3EC6E0]/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Briefcase className="h-7 w-7 text-[#3EC6E0]" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Project Opportunities</h3>
                <p className="text-gray-300">
                  Access exclusive freelance projects through our network of partner companies and organizations.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Ideal Candidate Section */}
        <section className="py-20 bg-gradient-to-br from-[#161c42] to-[#080c24]">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">The Ideal NURD Trainer</h2>
              <p className="text-xl text-gray-300">
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
              <motion.div variants={item} className="glass-card bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20">
                <h3 className="text-xl font-bold mb-6 text-[#3DE053]">What You'll Bring</h3>
                <ul className="text-white space-y-4">
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
              
              <motion.div variants={item} className="glass-card bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20">
                <h3 className="text-xl font-bold mb-6 text-[#3EC6E0]">What You'll Do</h3>
                <ul className="text-white space-y-4">
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
        <section className="py-20 bg-gradient-to-br from-[#080c24] to-[#161c42]">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Join Our Team?</h2>
              <p className="text-xl text-gray-300">
                Apply now to become a NURD trainer and help shape the next generation of tech innovators.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeIn}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleSubmit} className="glass-card bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white mb-1">First Name</label>
                    <Input id="firstName" placeholder="Your first name" className="bg-white/20 border-white/20 text-white placeholder:text-gray-300" required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white mb-1">Last Name</label>
                    <Input id="lastName" placeholder="Your last name" className="bg-white/20 border-white/20 text-white placeholder:text-gray-300" required />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email Address</label>
                  <Input id="email" type="email" placeholder="you@example.com" className="bg-white/20 border-white/20 text-white placeholder:text-gray-300" required />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="platforms" className="block text-sm font-medium text-white mb-1">Platforms You're Familiar With</label>
                  <Input id="platforms" placeholder="e.g. Vercel, Firebase, Replit" className="bg-white/20 border-white/20 text-white placeholder:text-gray-300" required />
                  <p className="mt-1 text-sm text-gray-300">Please list the platforms you have experience with, separated by commas.</p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="experience" className="block text-sm font-medium text-white mb-1">Years of Experience</label>
                  <Input id="experience" type="number" min="1" placeholder="2" className="bg-white/20 border-white/20 text-white placeholder:text-gray-300" required />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="motivation" className="block text-sm font-medium text-white mb-1">Why do you want to join our team?</label>
                  <Textarea id="motivation" placeholder="Tell us why you're interested in becoming a NURD trainer" className="min-h-[120px] bg-white/20 border-white/20 text-white placeholder:text-gray-300" required />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="portfolio" className="block text-sm font-medium text-white mb-1">Portfolio or LinkedIn URL</label>
                  <Input id="portfolio" type="url" placeholder="https://" className="bg-white/20 border-white/20 text-white placeholder:text-gray-300" required />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="credentials" className="block text-sm font-medium text-white mb-1">Upload Credentials</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/20 border-dashed rounded-md hover:border-white/40 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-300" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-300">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[#3DE053] hover:text-[#32bd45] focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-300">PDF, DOC, PNG up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-[#3DE053] hover:bg-[#32bd45] text-black font-medium">
                  Submit Application
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default JoinOurTeam;