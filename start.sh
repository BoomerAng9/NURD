#!/bin/bash
# Start script that runs both the main app and the port forwarder

# Run the start-all script using tsx
NODE_ENV=development tsx server/start-all.ts