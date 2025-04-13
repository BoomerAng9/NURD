import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import SummerExperienceSection from '@/components/sections/summer-experience-section';
import RegistrationSection from '@/components/sections/registration-section';
import NurdLogo from '@/components/ui/nurd-logo';
import DripEffect from '@/components/ui/drip-effect';
import nurdLogoGreen from '@assets/2C98236B-53D8-48A4-9DB3-E47C7540F061.png';
import kidComputerImage from '@assets/4288A514-4A16-4431-944E-9130EC4BCC2F.png';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      <Navbar />
      
      {/* Hero Section - Redesigned for instant engagement */}
      <section className="relative pt-20 overflow-hidden bg-gradient-to-b from-[#121645] to-[#6A2FF8]/90 text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center"></div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <img src={nurdLogoGreen} alt="NURD Logo" className="w-48 md:w-56 mx-auto" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-heading font-extrabold text-5xl md:text-7xl mb-6 leading-tight"
            >
              Where Tech <span className="text-[#3DE053]">Meets</span> Creativity
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl"
            >
              Join our transformative summer program designed to empower young minds through technology, creativity, and skill development.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register">
                <div className="btn-nurd text-center text-lg px-10 py-4 cursor-pointer">
                  Join the Summer Initiative
                </div>
              </Link>
              <Link href="/about">
                <div className="py-4 px-10 rounded-lg border-2 border-[#FF8A00] text-[#FF8A00] font-heading font-bold hover:bg-[#FF8A00] hover:text-white transition-all duration-300 text-lg cursor-pointer">
                  Learn More
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-20 w-full fill-gray-50">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.72C57.95,96.29,158.79,91.58,244.22,77.87c28.39-4.6,56.76-8.59,77.17-21.43Z"></path>
          </svg>
        </div>
        
        <DripEffect color="green" count={6} />
      </section>
      
      {/* Features Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Join NURD?</h2>
            <p className="text-xl text-gray-600">
              Our program is designed to inspire, challenge, and transform young minds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#3DE053] hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#3DE053]/10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3DE053]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Innovative Learning</h3>
              <p className="text-gray-600">
                Cutting-edge curriculum that combines hands-on projects with AI-powered learning tools
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#6A2FF8] hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#6A2FF8]/10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6A2FF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Mentorship</h3>
              <p className="text-gray-600">
                Guidance from industry professionals who are passionate about nurturing the next generation
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#FF8A00] hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#FF8A00]/10 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Flexible Structure</h3>
              <p className="text-gray-600">
                Choose between in-person workshops in Atlanta/Pooler or virtual sessions from anywhere
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Program Highlights */}
      <SummerExperienceSection />
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#6A2FF8] font-medium tracking-wider text-sm uppercase">Success Stories</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Hear From Our Community</h2>
            <p className="text-lg text-gray-600">
              See the impact NURD has had on students and families.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#3DE053]/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-[#3DE053]">J</span>
                </div>
                <div>
                  <h3 className="font-medium">Jordan, 14</h3>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
              <blockquote className="text-gray-600 italic">
                "Before NURD, I thought coding was boring. Now I'm building games and apps I actually want to use! The mentors make learning feel like fun, not work."
              </blockquote>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#6A2FF8]/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-[#6A2FF8]">M</span>
                </div>
                <div>
                  <h3 className="font-medium">Michelle, 42</h3>
                  <p className="text-sm text-gray-500">Parent</p>
                </div>
              </div>
              <blockquote className="text-gray-600 italic">
                "The growth I've seen in my daughter is incredible. She's not just learning tech skills—she's developing confidence, creativity, and better problem-solving abilities."
              </blockquote>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#FF8A00]/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-[#FF8A00]">T</span>
                </div>
                <div>
                  <h3 className="font-medium">Tyrone, 16</h3>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
              <blockquote className="text-gray-600 italic">
                "NURD helped me discover what I want to do after high school. The projects we built look great in my portfolio, and I've already started freelancing!"
              </blockquote>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Registration */}
      <RegistrationSection />
      
      <Footer />
    </div>
  );
};

export default Home;
