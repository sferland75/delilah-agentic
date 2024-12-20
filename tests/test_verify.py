# tests/test_verify.py
import pytest
from sqlalchemy import text

pytestmark = pytest.mark.asyncio

async def test_db_connection(async_session):
    async with async_session.begin():
        result = await async_session.execute(text("SELECT 1"))
        value = result.scalar()
        assert value == 1

async def test_correct_database(async_session):
    async with async_session.begin():
        result = await async_session.execute(text("SELECT current_database()"))
        db_name = result.scalar()
        assert db_name == "delilah_test"