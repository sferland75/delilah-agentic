# tests/test_db_connection.py
import pytest
from sqlalchemy import text

async def test_database_connection(test_db):
    """Test that we can connect to the test database."""
    async with test_db as session:
        result = await session.execute(text("SELECT 1"))
        assert result.scalar() == 1

async def test_database_credentials(test_db):
    """Test that we're using the correct database."""
    async with test_db as session:
        result = await session.execute(
            text("SELECT current_database()")
        )
        assert result.scalar() == "delilah_test"

        result = await session.execute(
            text("SELECT current_user")
        )
        assert result.scalar() == "test"