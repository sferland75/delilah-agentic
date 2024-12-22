#!/bin/bash

# Exit on error
set -e

echo "Setting up Delilah Agentic development environment..."

# Create necessary directories
mkdir -p data/metrics data/state

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
  cp config/deployment/development.env .env
  echo "Created .env file from template"
 fi

# Build and start containers
echo "Starting development containers..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Run database migrations
echo "Running database migrations..."
docker-compose -f docker-compose.dev.yml exec app npm run migrate

# Initialize development data
echo "Initializing development data..."
docker-compose -f docker-compose.dev.yml exec app npm run seed

echo "
Development environment is ready!

API running on: http://localhost:8080
Frontend running on: http://localhost:3000

Use these commands:
- 'docker-compose -f docker-compose.dev.yml logs -f' to view logs
- 'docker-compose -f docker-compose.dev.yml down' to stop"
