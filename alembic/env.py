import logging
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('alembic')

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here for 'autogenerate' support
target_metadata = None

def run_migrations_offline() -> None:
    url = "postgresql://postgres:postgres@localhost:5432/delilah_agentic"
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    logger.info("Starting migrations")
    
    config_settings = {
        'sqlalchemy.url': "postgresql://postgres:postgres@localhost:5432/delilah_agentic"
    }
    
    connectable = engine_from_config(
        config_settings,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    try:
        with connectable.connect() as connection:
            logger.info("Connected to database")
            
            # Execute a test query
            result = connection.execute("SELECT current_database()")
            db_name = result.scalar()
            logger.info(f"Current database: {db_name}")
            
            context.configure(
                connection=connection,
                target_metadata=target_metadata
            )

            with context.begin_transaction():
                logger.info("Beginning transaction")
                context.run_migrations()
                logger.info("Migrations complete")
                
                # Check tables after migration
                result = connection.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
                tables = [row[0] for row in result]
                logger.info(f"Tables after migration: {tables}")
                
    except Exception as e:
        logger.error(f"Error during migration: {str(e)}")
        raise

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()