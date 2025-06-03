import React from 'react';
import { Helmet } from 'react-helmet';

interface MetaDataProps {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

/**
 * SEO MetaData component for optimizing page metadata
 * Used to add title, description, keywords and Open Graph data to pages
 */
export const MetaData: React.FC<MetaDataProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = '/nurd-logo.png',
  ogType = 'website'
}) => {
  // Default base URL - should be updated with your domain in production
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;
  
  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="NURD Initiative" />
    </Helmet>
  );
};

export default MetaData;