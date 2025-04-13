import React from 'react';

const WhatIsNurdSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-purple-600 font-medium tracking-wider text-sm uppercase">What is NURD?</span>
          <h2 className="section-title mt-2">NURD = Naturally Unstoppable Resourceful Dreamers</h2>
          <p className="text-lg text-gray-600">
            NURD is more than a program; it's a movement. We teach participants to articulate their visions and collaborate with AI to build them, embodying the true spirit of vibe coding.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="card-nurd border-t-[#22C55E] group">
            <div className="w-14 h-14 mb-6 rounded-full bg-[#22C55E]/10 flex items-center justify-center group-hover:bg-[#22C55E]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Creativity First</h3>
            <p className="text-gray-600 mb-4">
              We put imagination at the forefront, teaching students how to transform abstract ideas into concrete projects.
            </p>
            <div className="pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-[#22C55E] flex items-center">
                Learn creative processes
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="card-nurd border-t-[#3B82F6] group">
            <div className="w-14 h-14 mb-6 rounded-full bg-[#3B82F6]/10 flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">AI Collaboration</h3>
            <p className="text-gray-600 mb-4">
              Students learn to work with AI tools to accelerate their development process and bring projects to life faster.
            </p>
            <div className="pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-[#3B82F6] flex items-center">
                Master AI-assisted development
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="card-nurd border-t-[#F97316] group">
            <div className="w-14 h-14 mb-6 rounded-full bg-[#F97316]/10 flex items-center justify-center group-hover:bg-[#F97316]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Community Building</h3>
            <p className="text-gray-600 mb-4">
              Join a network of like-minded creators who support each other's growth and collaborate on innovative projects.
            </p>
            <div className="pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-[#F97316] flex items-center">
                Connect with peers
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <a href="#methodology" className="btn-nurd">Discover the NURD Philosophy</a>
        </div>
      </div>
    </section>
  );
};

export default WhatIsNurdSection;
