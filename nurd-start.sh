#!/bin/bash
# Custom startup script for NURD application in Replit

# First, start the port forwarder in the background
echo "Starting port forwarding service..."
node replit-port.js &
REPLIT_PORT_PID=$!

# Wait a moment to ensure port 5000 is available for Replit
sleep 2

# Now start the main application
echo "Starting NURD application..."
NODE_ENV=development tsx server/index.ts

# Clean up port forwarder if the main app exits
kill $REPLIT_PORT_PID