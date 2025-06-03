import React from 'react';
import { Link } from 'wouter';

const SummerExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-[#F1F5F9]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#8B5CF6] font-medium tracking-wider text-sm uppercase">The NURD Summer Experience</span>
          <h2 className="section-title mt-2">Your Journey Begins Here</h2>
          <p className="text-lg text-gray-600">
            A dynamic blend of learning, creativity, and fun designed to transform how students interact with technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Module 1 */}
          <div className="card-nurd border-t-[#22C55E] group h-full flex flex-col">
            <div className="w-14 h-14 mb-6 rounded-full bg-[#22C55E]/10 flex items-center justify-center group-hover:bg-[#22C55E]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">AI-Powered Projects</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Bring your wildest ideas to life using cutting-edge AI tools. Learn how to collaborate with technology to accelerate your creative process.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-auto">
              <span className="font-medium text-sm text-[#22C55E]">Week 1-2</span>
              <p className="text-sm text-gray-600 mt-1">From concept sketches to functional prototypes using AI assistance</p>
            </div>
          </div>
          
          {/* Module 2 */}
          <div className="card-nurd border-t-[#3B82F6] group h-full flex flex-col">
            <div className="w-14 h-14 mb-6 rounded-full bg-[#3B82F6]/10 flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Interactive Workshops</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Hands-on sessions in coding, design, and problem-solving led by industry professionals who bring real-world experience.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-auto">
              <span className="font-medium text-sm text-[#3B82F6]">Week 3-4</span>
              <p className="text-sm text-gray-600 mt-1">Skills development through guided instruction and collaborative activities</p>
            </div>
          </div>
          
          {/* Module 3 */}
          <div className="card-nurd border-t-[#8B5CF6] group h-full flex flex-col">
            <div className="w-14 h-14 mb-6 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center group-hover:bg-[#8B5CF6]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Creative Challenges</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Tackle exciting weekly challenges designed to stretch your thinking and push the boundaries of what's possible with technology.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-auto">
              <span className="font-medium text-sm text-[#8B5CF6]">Week 5-6</span>
              <p className="text-sm text-gray-600 mt-1">Innovative problem-solving through themed weekly competitions</p>
            </div>
          </div>
          
          {/* Module 4 */}
          <div className="card-nurd border-t-[#F97316] group h-full flex flex-col">
            <div className="w-14 h-14 mb-6 rounded-full bg-[#F97316]/10 flex items-center justify-center group-hover:bg-[#F97316]/20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Community Building</h3>
            <p className="text-gray-600 mb-4 flex-grow">
              Connect with peers and mentors who share your passion for technology and creativity, forming relationships that extend beyond the program.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-auto">
              <span className="font-medium text-sm text-[#F97316]">Throughout</span>
              <p className="text-sm text-gray-600 mt-1">Collaborative projects and social activities integrated across all weeks</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/register">
            <div className="btn-nurd text-lg inline-block cursor-pointer">Reserve Your Spot</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SummerExperienceSection;
