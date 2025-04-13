import React from 'react';
import { Link } from 'wouter';
import NurdLogo from '@/components/ui/nurd-logo';

const RegistrationSection: React.FC = () => {
  return (
    <section id="signup" className="py-20 bg-gradient-nurd relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <h2 className="font-heading font-bold text-3xl mb-2 text-gray-900">Become a NURD</h2>
              <p className="text-gray-600 mb-6">
                Join us this summer to embark on a journey where your ideas take center stage, and your creativity knows no bounds.
              </p>
              
              <Link href="/register">
                <a className="btn-nurd w-full text-center py-4">
                  Start Your NURD Journey
                </a>
              </Link>

              <p className="text-center text-gray-500 mt-4 text-sm">
                Already registered? <Link href="/dashboard"><a className="text-blue-600 hover:underline">Sign in to your dashboard</a></Link>
              </p>
            </div>
            
            <div className="bg-gray-900 p-8 md:p-10 text-white flex flex-col justify-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6">
                  <NurdLogo variant="large" color="green" />
                </div>
                
                <blockquote className="text-xl italic text-center">
                  "At NURD, we don't just teach coding; we inspire creators."
                </blockquote>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>8-week summer program (June-August)</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Virtual and in-person options available</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All skill levels welcome (ages 8-18)</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Equipment provided if needed</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Scholarship opportunities available</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="mb-4">Need more information?</p>
                <a href="mailto:info@nurdcoding.com" className="inline-block py-2 px-6 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  Schedule a Parent Info Session
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
