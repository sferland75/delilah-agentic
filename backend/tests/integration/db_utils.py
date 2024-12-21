import asyncio
import asyncpg
from typing import Optional
import os
import subprocess

async def create_test_database():
    """Create test database from SQL script"""
    # Get the path to the SQL file
    sql_file = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        'database',
        'init_test_db.sql'
    )
    
    # Execute SQL script using psql
    subprocess.run([
        'psql',
        '-U', 'postgres',
        '-f', sql_file
    ])

async def clear_test_database():
    """Clear all data from test database"""
    conn = await asyncpg.connect(
        user='postgres',
        password='postgres',
        database='delilah_test',
        host='localhost'
    )
    
    try:
        # Disable foreign key checks
        await conn.execute('SET CONSTRAINTS ALL DEFERRED')
        
        # Clear all tables
        tables = [
            'task_state_transitions',
            'agent_state_transitions',
            'agent_tasks',
            'agents'
        ]
        
        for table in tables:
            await conn.execute(f'TRUNCATE TABLE {table} CASCADE')
            
    finally:
        await conn.close()

async def get_row_count(table: str) -> int:
    """Get number of rows in a table"""
    conn = await asyncpg.connect(
        user='postgres',
        password='postgres',
        database='delilah_test',
        host='localhost'
    )
    
    try:
        result = await conn.fetchval(f'SELECT COUNT(*) FROM {table}')
        return result
    finally:
        await conn.close()

async def verify_foreign_keys():
    """Verify all foreign key constraints"""
    conn = await asyncpg.connect(
        user='postgres',
        password='postgres',
        database='delilah_test',
        host='localhost'
    )
    
    try:
        # Check agent_tasks foreign keys
        result = await conn.fetch('''
            SELECT at.id, at.agent_id 
            FROM agent_tasks at 
            LEFT JOIN agents a ON at.agent_id = a.id 
            WHERE a.id IS NULL
        ''')
        if result:
            raise ValueError(f"Found {len(result)} agent_tasks with invalid agent_id")
            
        # Check state transition foreign keys
        result = await conn.fetch('''
            SELECT ast.id, ast.agent_id 
            FROM agent_state_transitions ast 
            LEFT JOIN agents a ON ast.agent_id = a.id 
            WHERE a.id IS NULL
        ''')
        if result:
            raise ValueError(f"Found {len(result)} agent_state_transitions with invalid agent_id")
            
        result = await conn.fetch('''
            SELECT tst.id, tst.task_id 
            FROM task_state_transitions tst 
            LEFT JOIN agent_tasks at ON tst.task_id = at.id 
            WHERE at.id IS NULL
        ''')
        if result:
            raise ValueError(f"Found {len(result)} task_state_transitions with invalid task_id")
            
    finally:
        await conn.close()