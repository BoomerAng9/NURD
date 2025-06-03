import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Laptop, 
  BookOpen, 
  PenTool, 
  MessageCircle, 
  Clock3, 
  Award, 
  Briefcase,
  GraduationCap,
  Presentation,
  User,
  Binary,
  Sparkles,
  ArrowRight,
  CircleCheck,
  PersonStanding,
  TreePine
} from 'lucide-react';

// Workshop locations
const locations = [
  {
    city: 'Atlanta',
    venues: [
      'Ponce City Market Tech Hub',
      'Piedmont Park Workshop Space',
      'Atlanta BeltLine Meeting Areas',
      'Georgia Tech Innovation Center'
    ],
    image: 'https://images.unsplash.com/photo-1575931953834-195eb4ee993c?q=80&w=1000'
  },
  {
    city: 'Pooler',
    venues: [
      'Pooler Innovation Center',
      'Savannah Tech Satellite Campus',
      'Outdoor Pavilion at Pooler Park',
      'The Shops at Godley Station Community Room'
    ],
    image: 'https://images.unsplash.com/photo-1525452106171-ed4fa8545fc7?q=80&w=1000'
  }
];

// Cohort dates
const cohorts = [
  {
    id: 'summer-2025',
    name: 'Summer 2025',
    dates: 'June 15 - August 10, 2025',
    status: 'Open for Registration',
    locations: ['Atlanta', 'Pooler'],
    capacity: {
      total: 60,
      remaining: 42
    }
  },
  {
    id: 'fall-2025',
    name: 'Fall 2025',
    dates: 'September 20 - November 15, 2025',
    status: 'Coming Soon',
    locations: ['Atlanta', 'Pooler'],
    capacity: {
      total: 60,
      remaining: 60
    }
  }
];

// Course modules
const courseModules = [
  {
    category: 'Technical Skills',
    modules: [
      {
        title: 'Vibe Coding Fundamentals',
        description: 'Learn the basics of coding with a focus on creativity and expression',
        icon: <Binary className="h-5 w-5" />
      },
      {
        title: 'AI-Assisted Development',
        description: 'Harness the power of AI to enhance your coding and problem-solving skills',
        icon: <Sparkles className="h-5 w-5" />
      },
      {
        title: 'Web & App Deployment',
        description: 'Build and deploy your own web and mobile applications using modern platforms',
        icon: <Laptop className="h-5 w-5" />
      }
    ]
  },
  {
    category: 'Soft Skills',
    modules: [
      {
        title: 'Time Management',
        description: 'Master techniques to maximize productivity and balance multiple projects',
        icon: <Clock3 className="h-5 w-5" />
      },
      {
        title: 'Presentation Skills',
        description: 'Learn to effectively communicate your ideas and showcase your work',
        icon: <Presentation className="h-5 w-5" />
      },
      {
        title: 'Teamwork & Collaboration',
        description: 'Develop skills to work effectively in diverse teams and collaborative environments',
        icon: <Users className="h-5 w-5" />
      },
      {
        title: 'Professionalism',
        description: 'Build professional habits and learn workplace etiquette for future success',
        icon: <Briefcase className="h-5 w-5" />
      },
      {
        title: 'Career Development',
        description: 'Explore career paths and build a foundation for your future in technology',
        icon: <GraduationCap className="h-5 w-5" />
      }
    ]
  }
];

// Learning methods
const learningMethods = [
  {
    title: 'In-Person Workshops',
    description: 'Collaborative sessions in dynamic environments where students work together on hands-on projects',
    icon: <Users className="h-10 w-10 text-[#3DE053]" />,
    color: 'bg-[#3DE053]/10'
  },
  {
    title: 'Virtual Training',
    description: 'Live online sessions with expert instructors providing real-time guidance and feedback',
    icon: <Laptop className="h-10 w-10 text-[#6A2FF8]" />,
    color: 'bg-[#6A2FF8]/10'
  },
  {
    title: 'Self-Paced Learning',
    description: 'Structured modules that students can complete at their own pace with ongoing support',
    icon: <BookOpen className="h-10 w-10 text-[#3EC6E0]" />,
    color: 'bg-[#3EC6E0]/10'
  },
  {
    title: 'Outdoor Activities',
    description: 'Learning beyond the classroom in natural environments to inspire creativity and collaboration',
    icon: <TreePine className="h-10 w-10 text-[#FF8A00]" />,
    color: 'bg-[#FF8A00]/10'
  }
];

// Program outcomes
const outcomes = [
  {
    title: 'Technical Proficiency',
    description: 'Solid foundation in coding fundamentals and experience with real-world application development',
    icon: <Binary className="h-5 w-5 text-[#3DE053]" />
  },
  {
    title: 'Portfolio Development',
    description: 'Completed projects that demonstrate skills and creativity to share with future schools or employers',
    icon: <Briefcase className="h-5 w-5 text-[#3DE053]" />
  },
  {
    title: 'Professional Readiness',
    description: 'Communication, time management, and collaboration skills that translate to any environment',
    icon: <User className="h-5 w-5 text-[#3DE053]" />
  },
  {
    title: 'Independence',
    description: 'Self-confidence and problem-solving abilities to pursue personal projects and continue learning',
    icon: <PersonStanding className="h-5 w-5 text-[#3DE053]" />
  },
  {
    title: 'Industry Connections',
    description: 'Introduction to real-world technology professionals and potential mentorship opportunities',
    icon: <Users className="h-5 w-5 text-[#3DE053]" />
  },
  {
    title: 'Innovation Mindset',
    description: 'Creative approach to problem-solving and ability to identify opportunities for technology solutions',
    icon: <Sparkles className="h-5 w-5 text-[#3DE053]" />
  }
];

const Cohorts: React.FC = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Upcoming NURD Cohorts</h1>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Join our immersive program where young innovators develop technical expertise and essential life skills in a dynamic, supportive environment.
            </p>
            <Button className="bg-[#3DE053] hover:bg-[#32bd45] text-black font-medium px-8 py-6 text-lg">
              Register Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        {/* Cohort Sessions Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Available Cohorts</h2>
              <p className="text-xl text-gray-600">
                Our immersive programs run throughout the year in multiple locations. Spaces are limited to ensure personalized attention for each student.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {cohorts.map((cohort) => (
                <motion.div key={cohort.id} variants={item}>
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl">{cohort.name}</CardTitle>
                          <CardDescription className="text-base mt-1">{cohort.status}</CardDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          cohort.status === 'Open for Registration' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {cohort.status === 'Open for Registration' ? 'Enrolling' : 'Coming Soon'}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <span>{cohort.dates}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <span>{cohort.locations.join(' & ')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Users className="h-5 w-5 text-gray-500" />
                          <div>
                            <span>{cohort.capacity.remaining} of {cohort.capacity.total} spots remaining</span>
                            <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${((cohort.capacity.total - cohort.capacity.remaining) / cohort.capacity.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {cohort.status === 'Open for Registration' ? (
                        <Button className="w-full bg-[#3DE053] hover:bg-[#32bd45] text-black">
                          Register Now
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          Join Waitlist
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Program Outcomes Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What You'll Gain</h2>
              <p className="text-xl text-gray-600">
                Our program is designed to prepare young innovators for future success, whether they choose to pursue further education, start their own projects, or enter the workforce.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {outcomes.map((outcome, index) => (
                <motion.div key={index} variants={item} className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#3DE053]/20 p-3 rounded-full">
                      {outcome.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{outcome.title}</h3>
                      <p className="text-gray-600">{outcome.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Course Modules Section */}
        <section className="py-20 bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Curriculum</h2>
              <p className="text-xl opacity-90">
                Our program combines technical skills with essential soft skills to create well-rounded innovators ready for future opportunities.
              </p>
            </motion.div>
            
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="technical" className="w-full">
                <TabsList className="grid grid-cols-2 mb-8 bg-white/10 w-full max-w-md mx-auto">
                  <TabsTrigger value="technical">Technical Skills</TabsTrigger>
                  <TabsTrigger value="soft">Soft Skills</TabsTrigger>
                </TabsList>
                
                <TabsContent value="technical">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  >
                    {courseModules[0].modules.map((module, index) => (
                      <motion.div key={index} variants={item} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                          {module.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                        <p className="text-gray-300">{module.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="soft">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  >
                    {courseModules[1].modules.map((module, index) => (
                      <motion.div key={index} variants={item} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                          {module.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                        <p className="text-gray-300">{module.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Learning Methods Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Blended Learning Environment</h2>
              <p className="text-xl text-gray-600">
                Our program combines multiple learning approaches to create an engaging, effective experience that caters to different learning styles.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
            >
              {learningMethods.map((method, index) => (
                <motion.div key={index} variants={item} className="rounded-xl p-6 bg-white shadow-sm">
                  <div className={`${method.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                  <p className="text-gray-600">{method.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Locations Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Program Locations</h2>
              <p className="text-xl text-gray-600">
                Our cohorts take place in vibrant, inspiring locations in Atlanta and Pooler, Georgia. We incorporate the local environment into our learning experiences.
              </p>
            </motion.div>
            
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="atlanta" className="w-full">
                <TabsList className="grid grid-cols-2 mb-8 w-full max-w-md mx-auto">
                  <TabsTrigger value="atlanta">Atlanta, GA</TabsTrigger>
                  <TabsTrigger value="pooler">Pooler, GA</TabsTrigger>
                </TabsList>
                
                {locations.map((location) => (
                  <TabsContent key={location.city.toLowerCase()} value={location.city.toLowerCase()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">Workshop Locations in {location.city}</h3>
                        <p className="text-gray-600 mb-6">
                          Our {location.city} cohort takes advantage of various inspiring spaces throughout the city, including:
                        </p>
                        <ul className="space-y-4">
                          {location.venues.map((venue, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CircleCheck className="h-5 w-5 text-[#3DE053] mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{venue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="rounded-xl overflow-hidden shadow-lg">
                          <img 
                            src={location.image} 
                            alt={`${location.city} location`} 
                            className="w-full h-72 object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Next Cohort?</h2>
              <p className="text-xl opacity-90 mb-8">
                Register today to secure your spot in our upcoming Summer 2025 program. Early registration ensures you'll have a place in this transformative experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-[#3DE053] hover:bg-[#32bd45] text-black font-medium px-8 py-6 text-lg">
                  Register Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Request Information
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cohorts;