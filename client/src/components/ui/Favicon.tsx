import { useEffect } from 'react';

/**
 * Component to dynamically set favicon for the application
 */
const Favicon = () => {
  useEffect(() => {
    // Clear any existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    // Create favicon links
    const faviconIco = document.createElement('link');
    faviconIco.rel = 'icon';
    faviconIco.type = 'image/x-icon';
    faviconIco.href = '/favicon.ico';
    document.head.appendChild(faviconIco);

    const faviconPng = document.createElement('link');
    faviconPng.rel = 'icon';
    faviconPng.type = 'image/png';
    faviconPng.href = '/favicon.png';
    document.head.appendChild(faviconPng);
    
    // Clean up when component unmounts
    return () => {
      document.querySelectorAll('link[rel="icon"]').forEach(favicon => favicon.remove());
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default Favicon;