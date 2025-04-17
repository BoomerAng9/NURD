// Simple HTTP server on port 5000 to satisfy Replit's workflow requirements
// This allows us to have our actual server running on port 5005

import http from 'http';

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Redirecting...</title>
      <meta http-equiv="refresh" content="0;url=http://localhost:5005${req.url}">
      <style>
        body { font-family: Arial, sans-serif; margin: 50px; text-align: center; }
        h1 { color: #4a5568; }
        .loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .redirect-link { margin-top: 20px; color: #3182ce; }
      </style>
    </head>
    <body>
      <h1>NURD by ACHIEVEMOR</h1>
      <p>Redirecting to the main application...</p>
      <div class="loader"></div>
      <p class="redirect-link">
        <a href="http://localhost:5005${req.url}">Click here if you are not redirected automatically</a>
      </p>
      <script>
        // Redirect to the actual application port
        window.location.href = "http://localhost:5005${req.url}";
      </script>
    </body>
    </html>
  `);
});

// Try to start server on port 5000
try {
  server.listen(5000, '0.0.0.0', () => {
    console.log('Replit port handler running on http://localhost:5000');
    console.log('This server redirects to the main application on port 5005');
  });

  // Handle any errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error('Port 5000 is already in use. Unable to start port handler.');
      console.log('The existing service on port 5000 may already be handling redirects.');
    } else {
      console.error('Error starting Replit port handler:', err.message);
    }
  });
} catch (err) {
  console.error('Exception when starting port handler:', err.message);
}