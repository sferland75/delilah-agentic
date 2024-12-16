from setuptools import setup, find_packages

setup(
    name="delilah-fresh",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "sqlalchemy",
        "asyncpg",
        "pytest",
        "pytest-asyncio",
        "python-dotenv",
        "psycopg2-binary",
        "pydantic",
        "pydantic-settings"
    ]
)