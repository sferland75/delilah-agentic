import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Add parent directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Import models
from backend.database.models import Base

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set SQLAlchemy URL in config
DATABASE_URL = "postgresql://delilah:delilah123@localhost:5432/delilah_db"
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# add your model's MetaData object here
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Configure SQLAlchemy for a PostgreSQL connection
    configuration = {
        'sqlalchemy.url': DATABASE_URL,
    }

    connectable = engine_from_config(
        configuration,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    try:
        with connectable.connect() as connection:
            context.configure(
                connection=connection,
                target_metadata=target_metadata
            )

            with context.begin_transaction():
                context.run_migrations()
    except Exception as e:
        print(f"Error during migration: {str(e)}")
        raise

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()