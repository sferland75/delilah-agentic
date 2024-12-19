import asyncio
from logging.config import fileConfig
<<<<<<< HEAD
import os
import sys

# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
=======
>>>>>>> 6bb53329c68f8c4735e833d296a7da5546e63a5d

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context
<<<<<<< HEAD
from config import settings
=======

from api.core.config import settings
>>>>>>> 6bb53329c68f8c4735e833d296a7da5546e63a5d
from database.models import Base

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
<<<<<<< HEAD
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
=======
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
target_metadata = Base.metadata

# Update the DB URL in alembic.ini
config.set_main_option("sqlalchemy.url", settings.POSTGRES_URL)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
>>>>>>> 6bb53329c68f8c4735e833d296a7da5546e63a5d
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

<<<<<<< HEAD
async def run_migrations_online() -> None:
    """Run migrations in 'online' mode.
    
    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.POSTGRES_URL
    
    connectable = async_engine_from_config(
        configuration,
=======
def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    """Run migrations in 'online' mode."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
>>>>>>> 6bb53329c68f8c4735e833d296a7da5546e63a5d
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

<<<<<<< HEAD
def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()
=======
def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())
>>>>>>> 6bb53329c68f8c4735e833d296a7da5546e63a5d

if context.is_offline_mode():
    run_migrations_offline()
else:
<<<<<<< HEAD
    asyncio.run(run_migrations_online())
=======
    run_migrations_online()
>>>>>>> 6bb53329c68f8c4735e833d296a7da5546e63a5d
