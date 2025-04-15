import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LandingContent } from '@shared/schema';
import { FadeIn, ScaleIn } from '@/components/animations/futuristic-transitions';

const Landing: React.FC = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  // Fetch landing content
  const { data: landingContent, isLoading } = useQuery<LandingContent[]>({
    queryKey: ['/api/landing-content'],
  });

  const openVideoModal = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setCurrentVideo('');
    setVideoModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="up">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Welcome to NURD Summer Initiative
                </h1>
                <p className="text-xl text-indigo-100">
                  Where creativity meets innovation. Join our immersive program designed to empower 
                  young minds with technology, creativity, and future-ready skills.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-indigo-700 hover:bg-indigo-100 font-bold"
                    asChild
                  >
                    <Link href="/register">Join the Program</Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => {
                      const introVideo = landingContent?.find(c => c.mediaType === 'video')?.mediaUrl;
                      if (introVideo) openVideoModal(introVideo);
                    }}
                  >
                    Watch Intro Video
                  </Button>
                </div>
              </div>
            </FadeIn>
            
            <ScaleIn className="hidden lg:block">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white/10">
                <img 
                  src="/hero-image.jpg" 
                  alt="NURD Summer Initiative" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1515879128292-8db3c2b2220c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent"></div>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>
      
      {/* Content Sections from Database */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading content...</p>
            </div>
          ) : landingContent && landingContent.length > 0 ? (
            <div className="space-y-24">
              {landingContent.map((section, index) => (
                <div key={section.id || index} className="max-w-6xl mx-auto">
                  <FadeIn direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 0.1}>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center ${index % 2 !== 0 ? 'md:grid-flow-dense' : ''}`}>
                      <div className={`space-y-6 ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                        <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                        <div 
                          className="prose prose-lg prose-indigo max-w-none" 
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                        {section.actionUrl && (
                          <div className="pt-4">
                            <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                              <Link href={section.actionUrl}>{section.actionText || 'Learn More'}</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className={index % 2 !== 0 ? 'md:col-start-1 md:row-start-1' : ''}>
                        {section.mediaUrl && (
                          section.mediaType === 'video' ? (
                            <div 
                              className="relative rounded-xl overflow-hidden aspect-video cursor-pointer shadow-lg"
                              onClick={() => openVideoModal(section.mediaUrl!)}
                            >
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                                <motion.div
                                  className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <svg className="w-10 h-10 text-indigo-700" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </motion.div>
                              </div>
                              {section.mediaThumbnail ? (
                                <img 
                                  src={section.mediaThumbnail} 
                                  alt={section.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ) : section.mediaType === 'document' ? (
                            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                              <div className="flex items-center mb-4">
                                <svg className="w-12 h-12 text-indigo-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div>
                                  <h3 className="text-lg font-semibold">{section.documentTitle || 'Resource Document'}</h3>
                                  <p className="text-gray-500">{section.documentDescription || 'Click to view or download'}</p>
                                </div>
                              </div>
                              <a 
                                href={section.mediaUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full text-center py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium rounded-lg transition-colors"
                              >
                                View Document
                              </a>
                            </div>
                          ) : (
                            <img 
                              src={section.mediaUrl} 
                              alt={section.title} 
                              className="w-full h-auto rounded-xl shadow-lg"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </FadeIn>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to our landing page!</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our administrator will be adding exciting content soon. Check back later for more information 
                about our program, testimonials, and resources.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Student Section with Gradient Text */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
            <div className="lg:w-1/2">
              <FadeIn direction="left">
                <div className="relative rounded-full overflow-hidden border-8 border-indigo-600 shadow-xl max-w-md mx-auto">
                  <img 
                    src="/nurd-student.png" 
                    alt="NURD Student" 
                    className="w-full h-auto"
                  />
                </div>
              </FadeIn>
            </div>
            <div className="lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0">
              <FadeIn direction="right">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text pb-2 animate-gradient-x">
                  Empowering Youth Through Innovative Learning
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  At NURD, we believe in creating a future where every student has the opportunity 
                  to develop technical skills, unleash creativity, and build lifelong connections.
                </p>
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  asChild
                >
                  <Link href="/programs">Explore Programs</Link>
                </Button>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* NURD Laptop Image Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 max-w-6xl mx-auto">
            <div className="lg:w-1/2 text-center lg:text-left">
              <FadeIn direction="left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-transparent bg-clip-text animate-gradient-x">
                  Cool Like That
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  Join a community of creative young minds who are building the future with code. 
                  Our NURD program gives you the tools and skills to turn your ideas into reality.
                </p>
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  asChild
                >
                  <Link href="/join">Join Us Today</Link>
                </Button>
              </FadeIn>
            </div>
            <div className="lg:w-1/2">
              <FadeIn direction="right">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/nurd-laptop.png" 
                    alt="NURD Laptop" 
                    className="w-full h-auto"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the NURD Summer Initiative?</h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto mb-8">
              Reserve your spot today and embark on a journey of creativity, innovation, and growth.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-indigo-700 hover:bg-indigo-100 font-bold"
                asChild
              >
                <Link href="/register">Register Now</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={closeVideoModal}>
          <div className="relative w-full max-w-4xl mx-4" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              onClick={closeVideoModal}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <iframe 
                  src={currentVideo} 
                  title="Video Player" 
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Landing;