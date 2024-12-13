# Delilah Agentic

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your specific configurations:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql+asyncpg://your_user:your_password@localhost:5432/your_database
   
   # Redis Configuration
   REDIS_URL=redis://localhost:6379
   
   # Rate Limiting
   RATE_LIMIT_PER_MINUTE=60
   
   # Application Settings
   APP_ENV=development
   DEBUG=true
   ```

3. Install dependencies:
   ```bash
   pip install redis pydantic-settings python-dotenv
   ```

4. Make sure Redis is running:
   ```bash
   # Ubuntu/Debian
   sudo service redis-server start
   
   # MacOS with Homebrew
   brew services start redis
   ```
