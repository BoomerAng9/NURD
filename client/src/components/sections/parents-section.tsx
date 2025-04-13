import React from 'react';
import { Link } from 'wouter';

const ParentsSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 order-2 md:order-1">
            <span className="text-[#3B82F6] font-medium tracking-wider text-sm uppercase">For Parents</span>
            <h2 className="section-title mt-2">Your Child's Imagination, Supercharged by AI.</h2>
            <p className="text-lg text-gray-600 mb-6">
              At NURD, we recognize that every child possesses unique creativity. Our program channels this creativity through AI-assisted coding, enabling them to bring their ideas to life. It's not just about learning to code; it's about learning to create with purpose.
            </p>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-heading font-bold text-gray-800">Empowering Future Creators</h4>
                <p className="text-gray-600">Transforming creativity into tangible skills for the future.</p>
              </div>
            </div>
            <Link href="/register" className="btn-nurd inline-block">
              Schedule a Parent Info Session
            </Link>
          </div>
          <div className="md:w-1/2 order-1 md:order-2 relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" 
                alt="Child working on creative project" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-lg">
                <p className="font-medium text-gray-900">"My son is now building apps I never thought possible at his age!"</p>
                <p className="text-sm text-gray-600">— Parent of NURD Student</p>
              </div>
            </div>
            
            {/* Circuit pattern overlay */}
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="absolute -top-10 -right-10 text-blue-500/10 z-0">
              <circle cx="80" cy="80" r="80" fill="currentColor" />
              <path d="M30 80h20M60 80h20M90 80h20M120 80h10M80 30v20M80 60v20M80 90v20M80 120v10" stroke="#3B82F6" strokeWidth="2"/>
              <circle cx="80" cy="80" r="5" fill="#3B82F6" />
              <circle cx="50" cy="80" r="3" fill="#3B82F6" />
              <circle cx="110" cy="80" r="3" fill="#3B82F6" />
              <circle cx="80" cy="50" r="3" fill="#3B82F6" />
              <circle cx="80" cy="110" r="3" fill="#3B82F6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParentsSection;
