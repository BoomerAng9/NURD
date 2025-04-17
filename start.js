// Script to start the application
import { spawn } from 'child_process';
import path from 'path';

console.log('Starting application...');

// Start the main application (now directly on port 5000)
const mainApp = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

// Handle main app events
mainApp.on('error', (err) => {
  console.error(`Main app error: ${err.message}`);
});

mainApp.on('close', (code) => {
  console.log(`Main app exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  mainApp.kill();
  process.exit(0);
});