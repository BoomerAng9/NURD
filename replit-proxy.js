// Simple Replit proxy to redirect port 5000 to 5005
import http from 'http';
import httpProxy from 'http-proxy';
const { createProxyServer } = httpProxy;

const REPLIT_PORT = 5000;
const ACTUAL_SERVER_PORT = 5005;

console.log(`Starting Replit proxy (${REPLIT_PORT} → ${ACTUAL_SERVER_PORT})...`);

// Create a proxy server
const proxy = createProxyServer({
  target: `http://localhost:${ACTUAL_SERVER_PORT}`,
  ws: true
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error(`Proxy error: ${err.message}`);
  if (res.writeHead) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Proxy error: ${err.message}`);
  }
});

// Create server to listen on Replit's expected port
const server = http.createServer((req, res) => {
  console.log(`Forwarding request: ${req.method} ${req.url}`);
  proxy.web(req, res);
});

// Handle WebSocket connections
server.on('upgrade', (req, socket, head) => {
  console.log(`Forwarding WebSocket connection: ${req.url}`);
  proxy.ws(req, socket, head);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${REPLIT_PORT} is already in use. Unable to start proxy.`);
    process.exit(1);
  } else {
    console.error(`Server error: ${err.message}`);
  }
});

// Start listening
server.listen(REPLIT_PORT, '0.0.0.0', () => {
  console.log(`Replit proxy server running on port ${REPLIT_PORT}`);
  console.log(`Forwarding all traffic to http://localhost:${ACTUAL_SERVER_PORT}`);
});