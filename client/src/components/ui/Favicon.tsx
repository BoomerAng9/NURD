import { useEffect } from 'react';
import nurdSkateboardPoolerImg from '@assets/nurd-skateboard-pooler.png';
import madeInPoolerImg from '@assets/Made in Pooler .png';

/**
 * Component to dynamically set favicon, title, and meta tags for the application
 */
const Favicon = () => {
  useEffect(() => {
    // Set document title
    document.title = 'NURD by ACHIEVEMOR';
    
    // Clear any existing favicon links and meta tags
    const existingFavicons = document.querySelectorAll('link[rel="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    // Remove existing meta tags
    document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(meta => meta.remove());
    
    // Create favicon links using direct import
    const faviconPng = document.createElement('link');
    faviconPng.rel = 'icon';
    faviconPng.type = 'image/png';
    faviconPng.href = nurdSkateboardPoolerImg;
    document.head.appendChild(faviconPng);
    
    // Add Open Graph meta tags for social sharing
    const metaTags = [
      // Open Graph tags
      { property: 'og:title', content: 'NURD by ACHIEVEMOR' },
      { property: 'og:description', content: 'Empowering youth through innovative technology education in Pooler, GA' },
      { property: 'og:image', content: madeInPoolerImg },
      { property: 'og:url', content: window.location.href },
      { property: 'og:type', content: 'website' },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'NURD by ACHIEVEMOR' },
      { name: 'twitter:description', content: 'Empowering youth through innovative technology education in Pooler, GA' },
      { name: 'twitter:image', content: madeInPoolerImg }
    ];
    
    // Add all meta tags to document head
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      const isTwitter = Object.keys(tag)[0] === 'name';
      
      if (isTwitter) {
        meta.name = tag.name;
      } else {
        meta.setAttribute('property', tag.property);
      }
      
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
    
    // Clean up when component unmounts
    return () => {
      document.querySelectorAll('link[rel="icon"]').forEach(favicon => favicon.remove());
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default Favicon;