from setuptools import setup, find_packages

setup(
    name="delilah_backend",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.100.0",  # Updated to newer version that supports Pydantic v2
        "uvicorn>=0.15.0",
        "pydantic>=2.0.0",
        "pydantic-settings>=2.0.0",
        "python-multipart>=0.0.5",
        "python-jose[cryptography]>=3.3.0",
        "passlib[bcrypt]>=1.7.4",
        "sqlalchemy>=1.4.0",
        "asyncpg>=0.27.0",
        "alembic>=1.7.0"
    ],
)