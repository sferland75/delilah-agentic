# PowerShell script for Windows setup

Write-Host "Setting up Delilah Agentic development environment..."

# Create necessary directories
New-Item -ItemType Directory -Force -Path data/metrics, data/state

# Copy environment file if it doesn't exist
if (-not (Test-Path .env)) {
    Copy-Item config/deployment/development.env .env
    Write-Host "Created .env file from template"
}

# Build and start containers
Write-Host "Starting development containers..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 5

# Run database migrations
Write-Host "Running database migrations..."
docker-compose -f docker-compose.dev.yml exec app npm run migrate

# Initialize development data
Write-Host "Initializing development data..."
docker-compose -f docker-compose.dev.yml exec app npm run seed

Write-Host "
Development environment is ready!

API running on: http://localhost:8080
Frontend running on: http://localhost:3000

Use these commands:
- 'docker-compose -f docker-compose.dev.yml logs -f' to view logs
- 'docker-compose -f docker-compose.dev.yml down' to stop"
