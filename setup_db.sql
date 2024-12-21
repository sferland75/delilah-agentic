-- Create mydb if it doesn't exist
SELECT 'CREATE DATABASE mydb' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mydb')\gexec

-- Create delilah_agentic if it doesn't exist
SELECT 'CREATE DATABASE delilah_agentic' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'delilah_agentic')\gexec

-- Connect to delilah_agentic and create required extensions
\c delilah_agentic
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";