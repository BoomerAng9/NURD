import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';
import { setupSSOAuth } from "./sso-auth";
import { securityHeaders } from "./middleware/security-headers";
import http from 'http';

// Create a simple HTTP server specifically for health checks
const healthServer = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'NURD by ACHIEVEMOR server is running' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Start health check server immediately on port 5000
healthServer.listen(5000, '0.0.0.0', () => {
  console.log('Health check server listening on port 5000');
});

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: true, // Allow all origins
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply security headers to all responses
app.use(securityHeaders);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use a different port for the main app since port 5000 is used for health checks
  const APP_PORT = 5005;
  
  // Clear any existing error handlers to avoid conflicts
  server.removeAllListeners('error');
  
  // Add a clean error handler for the port binding
  server.on('error', (err: any) => {
    log(`Error starting main application server: ${err.message}`);
    process.exit(1);
  });
  
  // Start server on the app port
  server.listen({
    port: APP_PORT,
    host: "0.0.0.0",
  }, () => {
    log(`Main application server listening on http://0.0.0.0:${APP_PORT}`);
    // Store the port in a global variable
    (global as any).SERVER_PORT = APP_PORT;
  });
})();
