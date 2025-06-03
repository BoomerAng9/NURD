/**
 * Proxy server to handle Replit's port forwarding requirements
 * This will forward requests from port 5000 to port 5005
 */
import http from 'http';
import httpProxy from 'http-proxy';
import { log } from './vite.js';

// The port that Replit's workflow is expecting
const REPLIT_PORT = 5000;
// The port our actual application is running on
const APP_PORT = 5005;

// Create a proxy server instance
const proxy = httpProxy.createProxyServer();

export async function startProxyServer() {
  // Create a server that uses the proxy
  const server = http.createServer((req, res) => {
    log(`Proxying request from port ${REPLIT_PORT} to ${APP_PORT}`, 'proxy');
    
    // Set the target and proxy the request
    proxy.web(req, res, {
      target: `http://localhost:${APP_PORT}`
    }, (err: Error) => {
      log(`Proxy error: ${err.message}`, 'proxy');
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('Proxy error');
    });
  });

  // Handle WebSocket connections
  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head, {
      target: `http://localhost:${APP_PORT}`
    });
  });

  // Start the proxy server
  try {
    server.listen(REPLIT_PORT, '0.0.0.0', () => {
      log(`Proxy server started on port ${REPLIT_PORT}, forwarding to ${APP_PORT}`, 'proxy');
    });
    
    // Handle server errors
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        log(`Port ${REPLIT_PORT} is already in use. Proxy not started.`, 'proxy');
        // Exit gracefully - this is expected in some Replit environments
      } else {
        log(`Error starting proxy server: ${err.message}`, 'proxy');
      }
    });
    
    return server;
  } catch (error) {
    log(`Exception starting proxy server: ${(error as Error).message}`, 'proxy');
    return null;
  }
}