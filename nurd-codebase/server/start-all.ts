/**
 * Script to start both the main application and the port forwarder
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting both servers...');

// Start the port forwarder
const portForwarder = spawn('tsx', [path.join(__dirname, 'port-forward.ts')], { 
  stdio: 'inherit',
  env: process.env
});

// Start the main application
const mainApp = spawn('tsx', [path.join(__dirname, 'index.ts')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

// Handle port forwarder events
portForwarder.on('error', (err) => {
  console.error(`Port forwarder error: ${err.message}`);
});

portForwarder.on('close', (code) => {
  console.log(`Port forwarder exited with code ${code}`);
  // We don't exit the process if the port forwarder exits, as this is expected
  // in some Replit environments where port 5000 is already in use
});

// Handle main app events
mainApp.on('error', (err) => {
  console.error(`Main app error: ${err.message}`);
});

mainApp.on('close', (code) => {
  console.log(`Main app exited with code ${code}`);
  // If the main app exits, kill the port forwarder as well
  portForwarder.kill();
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  portForwarder.kill();
  mainApp.kill();
  process.exit(0);
});