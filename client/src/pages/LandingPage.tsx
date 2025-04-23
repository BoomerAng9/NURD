import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  Play, 
  Pause, 
  Code, 
  Lightbulb, 
  Users, 
  Calendar, 
  ArrowRight,
  MessageSquare 
} from 'lucide-react';

const LandingPage = () => {
  const [, navigate] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    childAge: '',
    message: '',
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Toggle video play/pause
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle enrollment form submission
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enrollment form submitted:", formData);
    
    // Show success message
    toast({
      title: "Enrollment Request Received",
      description: "Thank you for your interest! We'll contact you soon with more details.",
    });
    
    // Close dialog
    setIsFormOpen(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      childAge: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Hero Section with Video */}
      <section className="relative h-screen flex flex-col items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 bg-black/60">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover opacity-70"
            poster="/attached_assets/nurd-skateboard-pooler.png"
            loop
            muted
          >
            <source src="/videos/coding-bootcamp.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-purple-900/30 to-black/70 z-10"></div>
        </div>
        
        {/* Video Controls */}
        <button 
          className="absolute bottom-10 right-10 z-20 bg-white/10 backdrop-blur-sm p-4 rounded-full hover:bg-white/20 transition-all"
          onClick={toggleVideo}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-white" />
          ) : (
            <Play className="h-6 w-6 text-white" />
          )}
        </button>
        
        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight">
            Become a NURD
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
            Where Creativity Meets Technology: Learn Prompt Engineering, 
            VIBE Coding, and Build Your Digital Future
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg"
              onClick={() => setIsFormOpen(true)}
            >
              Enroll Now
            </Button>
            <Button 
              variant="outline"
              className="border-white/30 hover:bg-white/10 text-white px-8 py-6 rounded-lg text-lg"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>
          
          {/* Statistics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-5 border border-white/10">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                500+
              </span>
              <p className="text-gray-300">Students Graduated</p>
            </div>
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-5 border border-white/10">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                25+
              </span>
              <p className="text-gray-300">Projects Completed</p>
            </div>
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-5 border border-white/10">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-400">
                98%
              </span>
              <p className="text-gray-300">Satisfaction Rate</p>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <svg className="w-6 h-6 text-white/70" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
      
      {/* Program Details Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Youth Coding Bootcamp
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A transformative 8-week program designed to introduce young minds to the world of coding,
              AI, and digital creativity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-blue-400">What You'll Learn</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 bg-blue-500/20 p-2 rounded-full">
                    <Code className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Prompt Engineering Fundamentals</h4>
                    <p className="text-gray-400">Master the art of crafting effective prompts for AI tools and create amazing digital content.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 bg-purple-500/20 p-2 rounded-full">
                    <Code className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">VIBE Coding</h4>
                    <p className="text-gray-400">Learn to use our Vibrant Imagination Build Environment to bring your ideas to life through code.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 bg-teal-500/20 p-2 rounded-full">
                    <Lightbulb className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Creative Problem-Solving</h4>
                    <p className="text-gray-400">Develop computational thinking skills and approach problems with a programmer's mindset.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 bg-pink-500/20 p-2 rounded-full">
                    <Users className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Collaborative Projects</h4>
                    <p className="text-gray-400">Work in teams to build real applications and games while learning essential teamwork skills.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-semibold mb-6 text-purple-400">Program Details</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-blue-500/20 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Program Duration</h4>
                    <p className="text-gray-400">8 weeks, with 2 sessions per week (3 hours each)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-teal-500/20 p-2 rounded-full">
                    <Users className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Age Groups</h4>
                    <p className="text-gray-400">Junior (8-12 years) and Teen (13-17 years) programs available</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-pink-500/20 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">No Prior Experience Needed</h4>
                    <p className="text-gray-400">Our curriculum is designed for complete beginners and adapts to each student's pace</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-purple-500/20 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Ongoing Support</h4>
                    <p className="text-gray-400">1 year of access to VIBE platform and mentorship after program completion</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg"
                  onClick={() => setIsFormOpen(true)}
                >
                  Register for Summer 2025
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hear from our young NURDs and their parents about their coding journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                      JT
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-1">
                      <div className="bg-gray-800 rounded-full p-0.5">
                        <Code className="h-3 w-3 text-purple-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 text-center">
                  "Before NURD, I had no idea how to code. Now I've built my own game and even created a website for my school club!"
                </p>
                <div className="text-center">
                  <p className="font-semibold">Jordan T.</p>
                  <p className="text-sm text-gray-400">Age 14, Completed Teen Program</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                      AM
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-teal-500 rounded-full p-1">
                      <div className="bg-gray-800 rounded-full p-0.5">
                        <Lightbulb className="h-3 w-3 text-teal-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 text-center">
                  "The instructors make learning so much fun! I love using VIBE to build things and show them to my friends."
                </p>
                <div className="text-center">
                  <p className="font-semibold">Aisha M.</p>
                  <p className="text-sm text-gray-400">Age 11, Completed Junior Program</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center text-white text-xl font-bold">
                      RL
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1">
                      <div className="bg-gray-800 rounded-full p-0.5">
                        <Users className="h-3 w-3 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 text-center">
                  "As a parent, I'm amazed at how my son has transformed. He's more confident, creative, and excited about learning since joining NURD."
                </p>
                <div className="text-center">
                  <p className="font-semibold">Rebecca L.</p>
                  <p className="text-sm text-gray-400">Parent of Junior NURD</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Begin Your Coding Journey?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join our next cohort of young NURDs and transform the way you think about technology.
              Limited spots available!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 rounded-lg text-lg font-semibold"
                onClick={() => setIsFormOpen(true)}
              >
                Enroll Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                className="border-white hover:bg-white/10 text-white px-8 py-6 rounded-lg text-lg"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
            
            <p className="mt-6 text-gray-300">
              Questions? Contact us at info@nurdinitiative.com or call (555) 123-4567
            </p>
          </div>
        </div>
      </section>
      
      {/* Enrollment Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Enroll in NURD Coding Bootcamp
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill out the form below to register your interest. Our team will contact you with all the details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEnrollSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Parent/Guardian Name"
                  className="bg-gray-800 border-gray-700"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 border-gray-700"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Your contact number"
                  className="bg-gray-800 border-gray-700"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="childAge">Child's Age</Label>
                <Input
                  id="childAge"
                  placeholder="Age of the participant"
                  className="bg-gray-800 border-gray-700"
                  value={formData.childAge}
                  onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  placeholder="Any specific requirements or questions?"
                  className="bg-gray-800 border-gray-700"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Submit Enrollment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;