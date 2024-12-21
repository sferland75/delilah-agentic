-- Drop test database if it exists
DROP DATABASE IF EXISTS delilah_test;

-- Create test database
CREATE DATABASE delilah_test;

-- Connect to test database
\c delilah_test

-- Create enum types
CREATE TYPE agent_status AS ENUM ('active', 'inactive', 'error', 'terminated');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'cancelled');

-- Create agents table
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(255) UNIQUE NOT NULL,
    agent_type VARCHAR(50) NOT NULL,
    status agent_status NOT NULL DEFAULT 'inactive',
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create agent_tasks table
CREATE TABLE agent_tasks (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES agents(id) NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    status task_status NOT NULL DEFAULT 'pending',
    priority INTEGER NOT NULL DEFAULT 0,
    input_data JSONB NOT NULL DEFAULT '{}',
    output_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create agent_state_transitions table
CREATE TABLE agent_state_transitions (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES agents(id) NOT NULL,
    from_state VARCHAR(50) NOT NULL,
    to_state VARCHAR(50) NOT NULL,
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create task_state_transitions table
CREATE TABLE task_state_transitions (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES agent_tasks(id) NOT NULL,
    from_state VARCHAR(50) NOT NULL,
    to_state VARCHAR(50) NOT NULL,
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_agents_agent_id ON agents(agent_id);
CREATE INDEX idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_state_transitions_agent_id ON agent_state_transitions(agent_id);
CREATE INDEX idx_task_state_transitions_task_id ON task_state_transitions(task_id);