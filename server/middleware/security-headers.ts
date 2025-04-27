import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to apply security headers to all responses
 * Implements Content Security Policy, HSTS, and other security best practices
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Set strict Content-Security-Policy
  // In development, we need to allow WebSocket connections and inline scripts for HMR
  const isDev = process.env.NODE_ENV === 'development';
  
  const cspDirectives = [
    "default-src 'self'",
    // For development, we need to allow WebSocket connections for HMR
    isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
    // For stripe and other payment providers
    "script-src 'self' https://js.stripe.com https://checkout.stripe.com",
    // For stripe checkout
    "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
    // For fonts and stylesheets
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // For fonts
    "font-src 'self' https://fonts.gstatic.com",
    // For images
    "img-src 'self' data: blob: https://placehold.co https://*.stripe.com"
  ].join('; ');

  // Set security headers
  res.setHeader('Content-Security-Policy', cspDirectives);
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