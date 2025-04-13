import React from 'react';
import { Link } from 'wouter';
import DripEffect from '@/components/ui/drip-effect';
import kidComputerImage from '@assets/4288A514-4A16-4431-944E-9130EC4BCC2F.png';
import nurdLogoGreen from '@assets/2C98236B-53D8-48A4-9DB3-E47C7540F061.png';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-20 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#121645]/80 to-[#121645]/90"></div>
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="mb-6 inline-block">
              <img src={nurdLogoGreen} alt="NURD Logo" className="w-48 md:w-60 mx-auto lg:mx-0 animate-pulse-slow" />
            </div>
            
            <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-white mb-6 drop-shadow-lg">
              BECOME A <span className="relative inline-block nurd-drip px-2 text-[#3DE053]">
                NURD
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-xl mx-auto lg:mx-0">
              Where Creativity Meets Code. Where Ideas Become Reality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <div className="btn-nurd text-center text-lg cursor-pointer">
                  Join the Summer Initiative
                </div>
              </Link>
              <a href="#about" className="py-3 px-6 rounded-lg border-2 border-[#FF8A00] text-[#FF8A00] font-heading font-bold hover:bg-[#FF8A00] hover:text-white transition-all duration-300 text-lg">
                Learn More
              </a>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10 max-w-md mx-auto">
              <div className="bg-[#3DE053]/20 backdrop-blur-sm rounded-2xl p-3 rotate-3 shadow-xl">
                <img 
                  src={kidComputerImage} 
                  alt="Kid using laptop with NURD sticker" 
                  className="rounded-xl shadow-lg"
                />
              </div>
              
              <div className="absolute -bottom-8 -right-8 bg-white p-4 rounded-lg shadow-lg max-w-xs rotate-3 z-20">
                <p className="italic text-gray-700 text-sm font-medium">
                  "I'm cool like that! Learning to code with NURD changed my summer!"
                </p>
                <p className="text-[#6A2FF8] font-medium text-sm mt-2">— Future Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DripEffect color="green" count={8} />
    </section>
  );
};

export default HeroSection;
