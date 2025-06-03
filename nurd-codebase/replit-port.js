/**
 * Special script to satisfy Replit's workflow port requirement
 * This immediately opens port 5000 with a minimal server
 */

import http from 'http';

// Create a minimal server on port 5000
const server = http.createServer((req, res) => {
  res.writeHead(302, {
    'Location': `http://${req.headers.host}:5005${req.url}`
  });
  res.end();
});

// Attempt to listen on port 5000
try {
  server.listen(5000, '0.0.0.0', () => {
    console.log('Replit port handler running on port 5000');
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Port 5000 is already in use. Another process might be handling it.');
    } else {
      console.error('Error starting Replit port handler:', err.message);
    }
  });
} catch (err) {
  console.error('Exception starting Replit port handler:', err.message);
}