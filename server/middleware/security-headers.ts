import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to apply security headers to all responses
 * Implements Content Security Policy, HSTS, and other security best practices
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Set more permissive Content-Security-Policy for development
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // In development, use less restrictive CSP to allow HMR and other dev tools
    const cspDirectives = [
      "default-src 'self'",
      "connect-src 'self' ws: wss: https: http:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",
      "style-src 'self' 'unsafe-inline' https: http:",
      "font-src 'self' data: https: http:",
      "img-src 'self' data: blob: https: http:",
      "frame-src 'self' https: http:",
      "media-src 'self' https: http:"
    ].join('; ');
    
    res.setHeader('Content-Security-Policy', cspDirectives);
  } else {
    // In production, use more restrictive CSP
    const cspDirectives = [
      "default-src 'self'",
      "connect-src 'self' ws: wss: https://blnry.com",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com https://blnry.com",
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://placehold.co https://*.stripe.com"
    ].join('; ');
    
    res.setHeader('Content-Security-Policy', cspDirectives);
  }

  // Set other security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Only set HSTS in production to avoid issues with localhost development
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Don't cache API responses
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }

  next();
}