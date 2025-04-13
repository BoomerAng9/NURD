import React from 'react';
import { Link } from 'wouter';
import DripEffect from '@/components/ui/drip-effect';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-nurd opacity-90"></div>
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading font-extrabold text-5xl md:text-7xl text-white mb-6 drop-shadow-lg">
            BECOME A <span className="relative inline-block">
              NURD
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#22C55E] rounded-full animate-drip"></span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10">
            Where Creativity Meets Code. Where Ideas Become Reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <a className="btn-nurd text-center text-lg">
                Join the Summer Initiative
              </a>
            </Link>
            <a href="#about" className="py-3 px-6 rounded-lg border-2 border-white text-white font-heading font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 text-lg">
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      <DripEffect count={8} />
    </section>
  );
};

export default HeroSection;
