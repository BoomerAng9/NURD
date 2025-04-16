import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { motion } from 'framer-motion';
import WhatIsNurdSection from '@/components/sections/what-is-nurd-section';
import MethodologySection from '@/components/sections/methodology-section';
import WhyChooseSection from '@/components/sections/why-choose-section';
import VibeCodingSection from '@/components/sections/vibe-coding-section';
import ParentsSection from '@/components/sections/parents-section';

const About: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      <Navbar />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-20"
      >
        {/* About Header Section */}
        <section className="py-16 bg-gradient-to-br from-[#121645] to-[#121645]/90 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">About ACHIEVEMOR</h1>
              <p className="text-xl leading-relaxed text-white">
                Driving innovation through expertise, creativity, and emerging technology implementation.
              </p>
            </div>
          </div>
        </section>

        {/* ACHIEVEMOR Organization Structure */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  ACHIEVEMOR is the global consulting arm that drives our innovative ecosystem—a house built on expertise, creativity, and emerging technology implementation. At the core of our operations is <span className="font-semibold text-[#121645]">The STARGATE</span>, a central hub that deploys our suite of branches we call portals.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
                  {/* The STARGATE */}
                  <div className="bg-gradient-to-br from-[#121645] to-[#121645]/80 p-8 rounded-xl text-white shadow-lg transform transition-transform hover:scale-105">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3DE053]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">The STARGATE</h3>
                    <p className="text-gray-300">
                      Our central hub that coordinates and deploys all ACHIEVEMOR portals, ensuring seamless operation and strategic alignment.
                    </p>
                  </div>
                  
                  {/* The Boost|Bridge */}
                  <div className="bg-gradient-to-br from-[#4A26AB] to-[#4A26AB]/80 p-8 rounded-xl text-white shadow-lg transform transition-transform hover:scale-105">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3DE053]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path>
                        <path d="M3 15h18"></path>
                        <path d="M19 8h2a2 2 0 0 1 2 2v1"></path>
                        <path d="M15 22v-4a2 2 0 0 1 2-2h4"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">The Boost|Bridge</h3>
                    <p className="text-gray-300">
                      Our collaboration portal that onboards learning partners by seamlessly connecting people and ideas.
                    </p>
                  </div>
                  
                  {/* OpenKlass AI */}
                  <div className="bg-gradient-to-br from-[#0B7285] to-[#0B7285]/80 p-8 rounded-xl text-white shadow-lg transform transition-transform hover:scale-105">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3DE053]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">OpenKlass AI</h3>
                    <p className="text-gray-300">
                      Dedicated to creating cutting-edge educational materials with a focus on AI-powered instructional design and curriculum development.
                    </p>
                  </div>
                </div>
                
                {/* NURD Initiative */}
                <div className="bg-gradient-to-r from-[#121645]/10 to-white p-8 rounded-xl border border-gray-200 mb-12">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-[#121645]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3DE053]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#121645] mb-3">The NURD Initiative</h3>
                      <p className="text-gray-700 leading-relaxed">
                        The <span className="font-semibold">NURD Initiative</span>, proudly born in Pooler, GA, exemplifies our commitment to fostering local talent and providing them with essential resources to compete today and tomorrow. By focusing on Pooler and Atlanta, NURD creates a tangible, community-based impact that resonates locally while drawing on global expertise.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  At ACHIEVEMOR, every portal functions as a conduit within our organization—each one interconnected through The STARGATE. This structure allows us to deliver comprehensive, innovative solutions under the vigilant guidance of our Human-In-The-Loop (HITL) framework, where advanced AI meets the critical oversight of human expertise.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  Join us on our journey as we continue to redefine workforce development, education, and community collaboration—bridging global insights with local impact, and transforming challenges into opportunities for growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NURD Initiative Section */}
        <WhatIsNurdSection />
        <MethodologySection />
        <WhyChooseSection />
        <VibeCodingSection />
        <ParentsSection />
        
        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-transparent bg-clip-text">Connect With Us</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-[#3DE053]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3DE053]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Email</h3>
                  <p className="text-gray-600 mb-1">General Inquiries</p>
                  <a href="mailto:nurds@achievemor.io" className="text-[#3DE053] font-medium hover:underline">
                    nurds@achievemor.io
                  </a>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-[#6A2FF8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6A2FF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Phone</h3>
                  <p className="text-gray-600 mb-1">Call or Text</p>
                  <a href="tel:9127429459" className="text-[#6A2FF8] font-medium hover:underline">
                    (912) 742-9459
                  </a>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#25D366]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">WhatsApp</h3>
                  <p className="text-gray-600 mb-1">Quick Response</p>
                  <a href="https://wa.me/19088991099" className="text-[#25D366] font-medium hover:underline">
                    (908) 899-1099
                  </a>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 text-lg">
                  Made with ❤️ in Pooler, GA
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default About;