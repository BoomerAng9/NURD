/**
 * Simple utility to open a window on port 5000 (needed for Replit workflow)
 * and redirect users to the actual application port at 5005
 */
import http from 'http';
import { log } from './vite.js';

// The port that Replit's workflow is expecting
const REPLIT_PORT = 5000;
// The port our actual application is running on
const APP_PORT = 5005;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  // Send a 302 redirect to the actual application URL
  const targetUrl = `http://${req.headers.host?.replace(String(REPLIT_PORT), String(APP_PORT))}${req.url}`;
  
  res.writeHead(302, {
    'Location': targetUrl
  });
  res.end();
});

// Start server and handle errors appropriately
try {
  server.listen(REPLIT_PORT, '0.0.0.0', () => {
    log(`Port forwarder running on port ${REPLIT_PORT}, redirecting to port ${APP_PORT}`, 'port-forward');
  });
  
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      log(`Port ${REPLIT_PORT} is already in use. Assuming another process is handling redirects.`, 'port-forward');
      // Exit gracefully - this is expected in some Replit environments
      process.exit(0);
    } else {
      log(`Error starting port forwarder: ${err.message}`, 'port-forward');
      process.exit(1);
    }
  });
} catch (err) {
  log(`Exception starting port forwarder: ${(err as Error).message}`, 'port-forward');
  process.exit(1);
}