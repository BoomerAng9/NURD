import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Zap, Users, Globe, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

const VibeCodingSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="vibe-coding" className="py-20 bg-gradient-to-br from-[#121645] to-[#2C2F7C] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Building Futures Through Vibe Coding</h2>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Welcome to a dynamic world where creativity ignites transformation. Here at ACHIEVEMOR (also known as ACHVMR), 
            we believe that coding is not just a technical skill—it's a canvas for self-expression.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeIn} className="order-2 md:order-1">
            <h3 className="text-3xl font-bold mb-4">Empowering the Next Generation</h3>
            <div className="w-20 h-1 bg-[#3DE053] mb-6"></div>
            <p className="mb-6 opacity-90">
              At ACHIEVEMOR, our mission is clear: to prepare tomorrow's leaders by empowering them with a skill set 
              that merges technology with creativity. Our summer initiative is carefully crafted to teach young minds 
              to express their vision and build real-world solutions—all while having fun, collaborating, and growing.
            </p>
            <Link href="/trainers">
              <Button className="bg-[#3DE053] hover:bg-[#32bd45] text-black font-medium">
                Meet Our Trainers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={fadeIn} className="order-1 md:order-2">
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-[#3EC6E0] to-[#6A2FF8] p-1">
              <div className="bg-[#121645] rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Code className="mr-3 text-[#3DE053]" />
                  What is Vibe Coding?
                </h3>
                <p className="mb-6 opacity-90">
                  Imagine coding where the lines of code fade into the background, and your child's personality takes 
                  center stage. With Vibe Coding, our learners are not just following instructions—they are actively 
                  collaborating with AI to bring their ideas to life.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-3 mt-0.5 text-[#3DE053]">•</div>
                    <p>Embracing intuitive, human-in-the-loop learning</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-0.5 text-[#3DE053]">•</div>
                    <p>Focusing on creative expression and problem-solving</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 mt-0.5 text-[#3DE053]">•</div>
                    <p>Turning passion into practical innovation</p>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-24"
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">A Blended Learning Experience</h3>
            <div className="w-20 h-1 bg-[#3DE053] mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto opacity-90">
              Our summer program is designed to adapt to every learning style, blending multiple 
              modes of education for a rich, immersive experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1C214D] bg-opacity-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="bg-[#3DE053] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-[#121645]" />
              </div>
              <h4 className="text-xl font-bold mb-4">In-Person Workshops</h4>
              <p className="opacity-80">
                Engaging, hands-on sessions held in vibrant urban hubs and invigorating outdoor 
                spaces—providing an inspiring backdrop for creative growth.
              </p>
            </div>

            <div className="bg-[#1C214D] bg-opacity-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="bg-[#6A2FF8] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4">Virtual Training</h4>
              <p className="opacity-80">
                Interactive sessions where technology meets creative collaboration, ensuring every
                student can engage in real-time, regardless of location.
              </p>
            </div>

            <div className="bg-[#1C214D] bg-opacity-50 rounded-xl p-8 shadow-lg transform transition-transform hover:scale-105">
              <div className="bg-[#3EC6E0] w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-[#121645]" />
              </div>
              <h4 className="text-xl font-bold mb-4">Self-Paced Learning</h4>
              <p className="opacity-80">
                Projects and challenges that empower young thinkers to explore at their own pace, 
                reinforcing both independence and teamwork.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-24 text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Join the Movement</h3>
          <div className="w-20 h-1 bg-[#3DE053] mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto mb-10 opacity-90">
            This summer, give your child a head start in a program that's as ambitious as it is inspiring. 
            ACHIEVEMOR isn't just a learning portal—it's a launchpad for future innovators, where every 
            challenge is an opportunity, every project a stepping stone toward a brighter tomorrow.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
            <Link href="/register">
              <Button className="bg-[#3DE053] hover:bg-[#32bd45] text-black font-medium px-8 py-6 text-lg">
                Join the Summer Initiative <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/trainers">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Meet Our Expert Trainers
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VibeCodingSection;