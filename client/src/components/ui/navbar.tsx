import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import NurdLogo from './nurd-logo';
import greenLogo from '@assets/2C98236B-53D8-48A4-9DB3-E47C7540F061.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white bg-opacity-95 backdrop-blur-md shadow-lg' : 'bg-[#121645]/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="relative">
              <img 
                src={greenLogo} 
                alt="NURD Logo" 
                className="h-10 md:h-12 w-auto object-contain" 
              />
              {!scrolled && (
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-[#FF8A00] rounded-full"></div>
              )}
            </div>
          </div>
        </Link>
        
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/#about" className={`font-medium ${
            scrolled ? 'text-[#121645] hover:text-[#6A2FF8]' : 'text-white hover:text-[#3DE053]'
          } transition duration-300`}>
            About
          </a>
          <a href="/#methodology" className={`font-medium ${
            scrolled ? 'text-[#121645] hover:text-[#6A2FF8]' : 'text-white hover:text-[#3DE053]'
          } transition duration-300`}>
            Methodology
          </a>
          <a href="/#experience" className={`font-medium ${
            scrolled ? 'text-[#121645] hover:text-[#6A2FF8]' : 'text-white hover:text-[#3EC6E0]'
          } transition duration-300`}>
            Experience
          </a>
          <Link href="/register">
            <div className="btn-nurd text-sm cursor-pointer">Join the Summer Initiative</div>
          </Link>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden ${scrolled ? 'text-[#121645]' : 'text-white'}`}
          aria-label="Toggle mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-xl border-t-2 border-[#3DE053]`}>
        <div className="px-4 py-6 space-y-4">
          <a href="/#about" className="block font-medium text-[#121645] hover:text-[#6A2FF8] transition-colors duration-300">
            About
          </a>
          <a href="/#methodology" className="block font-medium text-[#121645] hover:text-[#6A2FF8] transition-colors duration-300">
            Methodology
          </a>
          <a href="/#experience" className="block font-medium text-[#121645] hover:text-[#6A2FF8] transition-colors duration-300">
            Experience
          </a>
          <Link href="/register">
            <div className="block btn-nurd text-center mt-6 cursor-pointer">Join the Summer Initiative</div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
