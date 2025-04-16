import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/sections/footer';
import MetaData from '@/components/seo/meta-data';
import { Handshake, Globe, Building, Users, Award } from 'lucide-react';

const Partners: React.FC = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // SEO metadata
  const seoTitle = "Partners & Collaborators | NURD Initiative";
  const seoDescription = "Learn about the organizations, schools, and businesses partnering with the NURD Initiative to empower youth through technology education and creative learning.";
  const seoKeywords = "educational partnerships, technology education partners, STEAM learning collaborators, youth coding partnerships, business-education cooperation, community tech partnerships, NURD Initiative partners";

  return (
    <div className="min-h-screen flex flex-col">
      <MetaData 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical="/partners"
      />
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-4">Our Partners & Collaborators</h1>
              <p className="text-xl opacity-90 mb-6">
                Working together to create innovative learning opportunities and pathways to success 
                for the next generation of creators and technologists.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Partners Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              <motion.div 
                variants={item} 
                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Building className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Educational Institutions</h3>
                <p className="text-gray-600">
                  We partner with schools, universities, and educational organizations to bring cutting-edge 
                  tech education to students of all backgrounds.
                </p>
              </motion.div>
              
              <motion.div 
                variants={item} 
                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Industry Leaders</h3>
                <p className="text-gray-600">
                  Our industry partnerships help students connect learning to real-world applications 
                  and future career opportunities.
                </p>
              </motion.div>
              
              <motion.div 
                variants={item} 
                className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community Organizations</h3>
                <p className="text-gray-600">
                  We collaborate with community groups to ensure our programs reach underserved 
                  areas and diverse populations.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* Partnership Opportunities */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="max-w-3xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Partner With Us
              </h2>
              <p className="text-lg text-gray-600">
                Join our community of partners dedicated to empowering the next generation 
                of creative technologists and innovative thinkers.
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Handshake className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-3">Become a NURD Partner</h3>
                  <p className="text-gray-600 mb-6">
                    We're always looking for organizations that share our vision of empowering 
                    youth through technology education and creative learning.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a href="mailto:partnerships@nurd.org" className="btn-nurd px-6">
                      Contact Us
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80 font-medium underline underline-offset-4">
                      Download Partnership Info
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Coming Soon: Featured Partners */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-3 text-gray-400">Featured Partners</h2>
              <p className="text-gray-500 mb-6">
                Our featured partners section is coming soon. Check back to learn about the 
                amazing organizations that help make the NURD Initiative possible.
              </p>
              <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-400 italic">Partner logos coming soon</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Partners;