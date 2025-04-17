import { useEffect } from 'react';
import nurdSkateboardPoolerImg from '@assets/nurd-skateboard-pooler.png';

/**
 * Component to dynamically set favicon and title for the application
 */
const Favicon = () => {
  useEffect(() => {
    // Set document title
    document.title = 'NURD by ACHIEVEMOR';
    
    // Clear any existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    // Create favicon links using direct import
    const faviconPng = document.createElement('link');
    faviconPng.rel = 'icon';
    faviconPng.type = 'image/png';
    faviconPng.href = nurdSkateboardPoolerImg;
    document.head.appendChild(faviconPng);
    
    // Clean up when component unmounts
    return () => {
      document.querySelectorAll('link[rel="icon"]').forEach(favicon => favicon.remove());
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default Favicon;