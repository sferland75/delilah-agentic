# setup.py
from setuptools import setup, find_packages

setup(
    name="delilah-agentic",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "sqlalchemy",
        "asyncpg",
        "pytest",
        "pytest-asyncio",
        "pydantic-settings"
    ],
)