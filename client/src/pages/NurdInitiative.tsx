import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Award, BookOpen, Users, Sparkles, Globe } from 'lucide-react';
import { Link } from 'wouter';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { BetaStamp } from '@/components/BetaStamp';

const NurdInitiative: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>The NURD Initiative | NURD by ACHIEVEMOR</title>
        <meta 
          name="description" 
          content="Learn about the NURD Initiative - empowering youth through innovative technology education and creating pathways to success in the digital age."
        />
      </Helmet>

      <Container className="mt-6 mb-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white">
            <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-20 z-0"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-violet-200">
                  The NURD Initiative
                </h1>
                <p className="text-lg md:text-xl mb-6 text-blue-100">
                  Nurturing Unlimited Redesign and Development through innovative youth technology education.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/achievers">
                      Join the ACHIEVERS <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
                    <Link to="/access-ai">
                      Experience V.I.B.E.
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/3 p-4">
                <div className="relative aspect-square">
                  <OptimizedImage
                    src="/assets/nurd-logo-drip.png"
                    alt="NURD Initiative Logo"
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            <BetaStamp className="absolute bottom-4 right-4" />
          </Section>

          {/* Mission & Vision Section */}
          <Section className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="shadow-lg border-t-4 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Award className="h-6 w-6 mr-2 text-primary" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The NURD Initiative exists to empower youth through innovative technology education, 
                    fostering creativity and critical thinking while building pathways to future success 
                    in a digital world. We provide accessible, engaging, and inclusive coding and tech 
                    education that builds confidence and unlocks potential.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-t-4 border-secondary">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Sparkles className="h-6 w-6 mr-2 text-secondary" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We envision a future where all young people, regardless of background, have the 
                    skills, knowledge, and confidence to shape technology rather than merely consume it. 
                    Through our innovative V.I.B.E. platform and personalized learning experiences, we 
                    aim to cultivate the next generation of creators, innovators, and digital leaders.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* Core Program Elements */}
          <Section className="mt-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Core Program Elements</h2>
            <Tabs defaultValue="vibe" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="vibe">V.I.B.E. Platform</TabsTrigger>
                <TabsTrigger value="learning">Learning Tracks</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="global">Global Impact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vibe" className="border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Vibrant Imagination Build Environment</h3>
                    <p className="mb-4">
                      Our proprietary V.I.B.E. platform provides an intuitive, engaging coding environment 
                      powered by multiple AI models to guide students through creative technology learning.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Adaptive learning that grows with each student</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Multi-model AI support from leading technologies</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Real-time collaboration capabilities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Project-based learning with instant feedback</span>
                      </li>
                    </ul>
                    <Button className="mt-6" asChild>
                      <Link to="/access-ai">
                        Try V.I.B.E. Now
                      </Link>
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <OptimizedImage
                      src="/assets/vibe-screenshot.png" 
                      alt="V.I.B.E. Platform Screenshot"
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="learning" className="border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-xl">
                    <OptimizedImage
                      src="/assets/learning-tracks.png" 
                      alt="NURD Learning Tracks"
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-2xl font-bold mb-4">Four Core Learning Tracks</h3>
                    <p className="mb-4">
                      Our curriculum is built around four innovative tracks designed to nurture diverse 
                      technical and creative skills:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="border-l-4 border-blue-500">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-base">Vibe Coding Foundations</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="border-l-4 border-green-500">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-base">World Builder Lab</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="border-l-4 border-purple-500">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-base">Prompt Mastery</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="border-l-4 border-amber-500">
                        <CardHeader className="py-3 px-4">
                          <CardTitle className="text-base">Collaboration Studio</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                    <Button className="mt-6" variant="outline" asChild>
                      <Link to="/achievers">
                        View All Programs <BookOpen className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="community" className="border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Building a Community of NURDs</h3>
                    <p className="mb-4">
                      We foster a vibrant community where young technology enthusiasts can connect, 
                      collaborate, and grow together in a supportive environment.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Peer-to-peer learning and mentorship opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Regular meetups and collaborative projects</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Skills exchange platform for shared growth</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Showcase events to celebrate achievements</span>
                      </li>
                    </ul>
                    <Button className="mt-6" variant="secondary" asChild>
                      <Link to="/skills-exchange">
                        <Users className="mr-2 h-4 w-4" /> Join Our Community
                      </Link>
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <OptimizedImage
                      src="/assets/community.png" 
                      alt="NURD Community"
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="global" className="border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-xl">
                    <OptimizedImage
                      src="/assets/global-impact.png" 
                      alt="Global Impact"
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-2xl font-bold mb-4">Global Impact & Sustainability</h3>
                    <p className="mb-4">
                      The NURD Initiative is committed to making a positive impact globally while
                      promoting sustainable technology practices and inclusive growth.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Access initiatives for underserved communities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Partnerships with global education organizations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Focus on sustainable technology solutions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Projects that address real-world challenges</span>
                      </li>
                    </ul>
                    <Button className="mt-6" variant="outline" asChild>
                      <Link to="/reinvestment">
                        <Globe className="mr-2 h-4 w-4" /> Learn About Reinvestment
                      </Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Section>

          {/* Impact Stats Section */}
          <Section className="mt-12 bg-muted p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Growing Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <Card className="bg-background/50 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-primary">100+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Active NURDs
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-background/50 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-primary">4</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Learning Tracks
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-background/50 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-primary">200+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Projects Created
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-background/50 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-primary">50+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    Community Events
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* Call to Action */}
          <Section className="mt-12">
            <Card className="border-none bg-gradient-to-r from-blue-500 to-indigo-700 text-white">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Ready to Start Your NURD Journey?</CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Join the NURD Initiative today and become part of our growing community of young innovators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-6">
                  Whether you're a complete beginner or already have some coding experience, our personalized 
                  programs will help you develop the skills and confidence to thrive in the digital world.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                  <Link to="/achievers">
                    Apply to ACHIEVERS Program
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 w-full sm:w-auto" asChild>
                  <Link to="/subscription-plans">
                    View Subscription Plans
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </Section>
        </motion.div>
      </Container>
    </>
  );
};

export default NurdInitiative;