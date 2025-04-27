import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';
import { setupSSOAuth } from "./sso-auth";
import { securityHeaders } from "./middleware/security-headers";

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

  // Try multiple ports with fallback mechanism
  const attemptListen = (ports: number[]) => {
    if (ports.length === 0) {
      log("Failed to start server on any port. Exiting.");
      process.exit(1);
      return;
    }
    
    const port = ports[0];
    const remainingPorts = ports.slice(1);
    
    const onError = (err: any) => {
      if (err.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use, trying next port...`);
        attemptListen(remainingPorts);
      } else {
        log(`Error starting server: ${err.message}`);
        process.exit(1);
      }
    };
    
    server.on('error', onError);
    
    try {
      server.listen({
        port,
        host: "0.0.0.0",
      }, () => {
        // Remove the error handler once we're successfully listening
        server.removeListener('error', onError);
        log(`Server successfully listening on http://0.0.0.0:${port}`);
        
        // Store the successful port in a global variable that can be accessed by other modules
        (global as any).SERVER_PORT = port;
      });
    } catch (err) {
      log(`Exception when starting server on port ${port}: ${(err as Error).message}`);
      attemptListen(remainingPorts);
    }
  };
  
  // Try port 5000 first (Replit's expected port), then fall back to others
  attemptListen([5000, 5005, 3000, 8080, 4000]);
})();
