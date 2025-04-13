import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import NurdLogo from './nurd-logo';

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
      scrolled ? 'bg-white bg-opacity-90 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            <div className="h-10 w-20 relative">
              <NurdLogo variant="default" color={scrolled ? 'green' : 'white'} />
            </div>
          </a>
        </Link>
        
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/#about" className={`font-medium ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-gray-200'} transition`}>About</a>
          <a href="/#methodology" className={`font-medium ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-gray-200'} transition`}>Methodology</a>
          <a href="/#experience" className={`font-medium ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-white hover:text-gray-200'} transition`}>Experience</a>
          <Link href="/register">
            <a className="btn-nurd">Join Now</a>
          </Link>
        </div>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden ${scrolled ? 'text-gray-900' : 'text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg`}>
        <div className="px-4 py-3 space-y-3">
          <a href="/#about" className="block font-medium text-gray-600 hover:text-blue-600 transition">About</a>
          <a href="/#methodology" className="block font-medium text-gray-600 hover:text-blue-600 transition">Methodology</a>
          <a href="/#experience" className="block font-medium text-gray-600 hover:text-blue-600 transition">Experience</a>
          <Link href="/register">
            <a className="block btn-nurd text-center">Join Now</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
