import { useEffect } from 'react';
import nurdSkateboardPoolerImg from '@assets/nurd-skateboard-pooler.png';

/**
 * Component to dynamically set favicon, title, and meta tags for the application
 */
const Favicon = () => {
  useEffect(() => {
    // Set document title
    document.title = 'NURD by ACHIEVEMOR';
    
    // Get base URL for absolute paths
    const baseUrl = window.location.origin;
    
    // Clear any existing favicon links and meta tags
    const existingFavicons = document.querySelectorAll('link[rel="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    // Remove existing meta tags
    document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(meta => meta.remove());
    
    // Create favicon links - use the favicon.png in public folder
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    faviconLink.href = `${baseUrl}/nurd-skateboard-pooler.png`; // Use the public folder favicon
    document.head.appendChild(faviconLink);
    
    // Create favicon for apple devices
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = `${baseUrl}/nurd-skateboard-pooler.png`;
    document.head.appendChild(appleTouchIcon);
    
    // Add Open Graph meta tags for social sharing with absolute URLs
    const metaTags = [
      // Open Graph tags
      { property: 'og:title', content: 'NURD by ACHIEVEMOR' },
      { property: 'og:description', content: 'Empowering youth through innovative technology education in Pooler, GA' },
      { property: 'og:image', content: `${baseUrl}/made-in-pooler.png` }, // Absolute URL for image
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:type', content: 'website' },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'NURD by ACHIEVEMOR' },
      { name: 'twitter:description', content: 'Empowering youth through innovative technology education in Pooler, GA' },
      { name: 'twitter:image', content: `${baseUrl}/made-in-pooler.png` } // Absolute URL for image
    ];
    
    // Add all meta tags to document head
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      const isTwitter = Object.keys(tag)[0] === 'name';
      
      if (isTwitter && tag.name) {
        meta.name = tag.name;
      } else if (!isTwitter && tag.property) {
        meta.setAttribute('property', tag.property);
      }
      
      meta.content = tag.content || '';
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