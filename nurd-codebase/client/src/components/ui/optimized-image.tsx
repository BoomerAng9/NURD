import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage component with lazy loading, loading state, and error handling
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  fallbackSrc = 'https://placehold.co/300x200?text=No+Image',
  priority = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(priority ? src : '');

  useEffect(() => {
    // If not priority, we'll lazy load it
    if (!priority && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgSrc(src);
        setIsLoading(false);
        onLoad?.();
      };
      img.onerror = () => {
        setError(true);
        setIsLoading(false);
        onError?.();
      };
    }
  }, [src, priority, onLoad, onError]);

  // If it's a priority image, load it immediately
  if (priority) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        onError={(e) => {
          setError(true);
          (e.target as HTMLImageElement).src = fallbackSrc;
          onError?.();
        }}
        onLoad={() => onLoad?.()}
      />
    );
  }

  if (isLoading) {
    return (
      <Skeleton 
        className={`${className} bg-muted/50`} 
        style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
      />
    );
  }

  if (error) {
    return (
      <img
        src={fallbackSrc}
        alt={`Error loading: ${alt}`}
        className={className}
        width={width}
        height={height}
      />
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}