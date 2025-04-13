import React from 'react';
import Navbar from '@/components/ui/navbar';
import HeroSection from '@/components/sections/hero-section';
import ParentsSection from '@/components/sections/parents-section';
import WhatIsNurdSection from '@/components/sections/what-is-nurd-section';
import MethodologySection from '@/components/sections/methodology-section';
import WhyChooseSection from '@/components/sections/why-choose-section';
import SummerExperienceSection from '@/components/sections/summer-experience-section';
import VibeCodingSection from '@/components/sections/vibe-coding-section';
import RegistrationSection from '@/components/sections/registration-section';
import Footer from '@/components/sections/footer';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-gray-50">
      <Navbar />
      <HeroSection />
      <ParentsSection />
      <WhatIsNurdSection />
      <MethodologySection />
      <WhyChooseSection />
      <SummerExperienceSection />
      <VibeCodingSection />
      <RegistrationSection />
      <Footer />
    </div>
  );
};

export default Home;
