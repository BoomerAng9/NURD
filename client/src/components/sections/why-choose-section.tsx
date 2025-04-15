import React from 'react';

const WhyChooseSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 items-center">
          
          <div className="w-full max-w-3xl mx-auto">
            <span className="text-[#3B82F6] font-medium tracking-wider text-sm uppercase">Why Choose NURD?</span>
            <h2 className="section-title mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Empowering Youth Through Innovative Learning</h2>
            <p className="text-lg text-gray-600 mb-8">
              A program where creativity, technology, and personal growth converge to prepare students for future academic and career opportunities.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center mt-1 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-800">Self-Expression Through Technology</h3>
                  <p className="text-gray-600">
                    Students learn to use coding and AI tools as mediums for creative expression, building confidence and communication skills.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mt-1 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-800">Critical Thinking & Problem-Solving</h3>
                  <p className="text-gray-600">
                    Develop essential cognitive skills by tackling real-world challenges through project-based learning.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mt-1 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-800">Community & Collaboration</h3>
                  <p className="text-gray-600">
                    Join a supportive network where students learn to work together on complex projects and build lasting friendships.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center mt-1 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-800">Future-Ready Skills</h3>
                  <p className="text-gray-600">
                    Prepare for tomorrow's opportunities by developing technical expertise that's increasingly valuable in an AI-driven world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
