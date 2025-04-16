import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import { motion } from 'framer-motion';
import WhatIsNurdSection from '@/components/sections/what-is-nurd-section';
import MethodologySection from '@/components/sections/methodology-section';
import WhyChooseSection from '@/components/sections/why-choose-section';
import VibeCodingSection from '@/components/sections/vibe-coding-section';
import ParentsSection from '@/components/sections/parents-section';

// Import images
import nurdLaptopImg from '@assets/4288A514-4A16-4431-944E-9130EC4BCC2F.png';
import boostBridgeImg from '@assets/IMG_0098.png';
import okaiLogoImg from '@assets/OKAI logo.png';
import nurdLogoImg from '@assets/33C74D57-C126-4BBE-A4B4-54F38CDD6AFD.png';

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
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/5 order-2 md:order-1">
                <img 
                  src={nurdLaptopImg} 
                  alt="NURD Laptop" 
                  className="rounded-lg shadow-xl transform hover:scale-[1.02] transition-transform duration-300 max-w-full"
                />
              </div>
              <div className="md:w-3/5 order-1 md:order-2">
                <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">About ACHIEVEMOR</h1>
                  <p className="text-xl leading-relaxed text-white">
                    Driving innovation through expertise, creativity, and emerging technology implementation.
                  </p>
                </div>
              </div>
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
                
                <h3 className="text-2xl font-bold mb-6 text-center">Our Portals</h3>
                
                <div className="flex flex-col gap-6 my-12 relative">
                  {/* Connecting line for staircase effect */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2 hidden md:block"></div>
                  
                  {/* The STARGATE - First in stacked staircase layout */}
                  <div className="relative md:ml-auto md:mr-8 w-full md:w-[85%] z-10">
                    <div className="bg-gradient-to-r from-[#121645] to-[#121645]/90 p-6 rounded-xl text-white shadow-lg transform transition-transform hover:scale-[1.01]">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/50 rounded-full flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-300">The STARGATE</h3>
                      </div>
                      <p className="text-gray-100 pl-20">
                        Our central hub that coordinates and deploys all ACHIEVEMOR portals, ensuring seamless operation and strategic alignment.
                      </p>
                    </div>
                    {/* Connecting dot */}
                    <div className="hidden md:block absolute left-0 top-1/2 w-6 h-6 bg-[#121645] rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-white z-20"></div>
                  </div>
                  
                  {/* The Boost|Bridge - Second in stacked staircase layout */}
                  <div className="relative md:ml-8 md:mr-auto w-full md:w-[85%] z-10">
                    <div className="bg-gradient-to-r from-[#4A26AB] to-[#4A26AB]/90 p-6 rounded-xl text-white shadow-lg transform transition-transform hover:scale-[1.01]">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mr-4">
                          <img src={boostBridgeImg} alt="BoostBridge Logo" className="h-14 w-auto object-contain" />
                        </div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-300">The Boost|Bridge</h3>
                      </div>
                      <p className="text-gray-100 pl-20">
                        Our collaboration portal that onboards learning partners by seamlessly connecting people and ideas.
                      </p>
                    </div>
                    {/* Connecting dot */}
                    <div className="hidden md:block absolute right-0 top-1/2 w-6 h-6 bg-[#4A26AB] rounded-full transform translate-x-1/2 -translate-y-1/2 border-4 border-white z-20"></div>
                  </div>
                  
                  {/* OpenKlass AI - Third in stacked staircase layout */}
                  <div className="relative md:ml-auto md:mr-8 w-full md:w-[85%] z-10">
                    <div className="bg-gradient-to-r from-[#0B7285] to-[#0B7285]/90 p-6 rounded-xl text-white shadow-lg transform transition-transform hover:scale-[1.01]">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mr-4">
                          <img src={okaiLogoImg} alt="OpenKlass AI Logo" className="h-14 w-auto object-contain" />
                        </div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-300">OpenKlass AI</h3>
                      </div>
                      <p className="text-gray-100 pl-20">
                        Dedicated to creating cutting-edge educational materials with a focus on AI-powered instructional design and curriculum development.
                      </p>
                    </div>
                    {/* Connecting dot */}
                    <div className="hidden md:block absolute left-0 top-1/2 w-6 h-6 bg-[#0B7285] rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-white z-20"></div>
                  </div>
                  
                  {/* NURD Initiative - Fourth in stacked staircase layout */}
                  <div className="relative md:ml-8 md:mr-auto w-full md:w-[85%] z-10">
                    <div className="bg-gradient-to-r from-[#121645] to-[#121645]/90 p-6 rounded-xl text-white shadow-lg transform transition-transform hover:scale-[1.01]">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 flex items-center justify-center mr-4">
                          <img src={nurdLogoImg} alt="NURD Logo" className="h-14 w-auto object-contain" />
                        </div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-300">The NURD Initiative</h3>
                      </div>
                      <p className="text-gray-100 pl-20">
                        Proudly born in Pooler, GA, exemplifies our commitment to fostering local talent and providing them with essential resources to compete today and tomorrow.
                      </p>
                    </div>
                    {/* Connecting dot */}
                    <div className="hidden md:block absolute right-0 top-1/2 w-6 h-6 bg-[#121645] rounded-full transform translate-x-1/2 -translate-y-1/2 border-4 border-white z-20"></div>
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