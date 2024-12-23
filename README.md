# Delilah Agentic

Modular AI system for Occupational Therapy field assessments and reporting.

## Setup Instructions

1. Install PostgreSQL 16
2. Create database and user:
   ```sql
   CREATE USER delilah WITH PASSWORD 'delilah123';
   CREATE DATABASE delilah_db;
   GRANT ALL PRIVILEGES ON DATABASE delilah_db TO delilah;
   ```

3. Grant schema privileges:
   ```sql
   \c delilah_db
   GRANT ALL ON SCHEMA public TO delilah;
   ALTER USER delilah SET search_path TO public;
   ```

4. Install dependencies:
   ```bash
   pip install alembic psycopg2-binary
   ```

5. Run migrations:
   ```bash
   alembic upgrade head
   ```

## Development

See CONTRIBUTING.md for development workflow and guidelines.