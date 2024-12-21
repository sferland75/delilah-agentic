# ADR 2: Database Design

## Status
Accepted

## Context
Need to design a database schema that supports:
- Agent state management
- Task tracking
- State transition history
- Performance monitoring

## Decision
Implement a PostgreSQL schema with:
- Agents table for agent metadata
- Tasks table for work items
- State transition tables for history
- JSON fields for flexible data storage

## Consequences
### Positive
- Complete history of agent actions
- Flexible data structure with JSON
- Easy to query and analyze
- Good performance characteristics

### Negative
- Storage overhead for history
- Need for careful index management
- Potential for JSON field complexity

## Implementation Details
- Schema in `database/models.py`
- Migrations will be managed by Alembic
- Integration tests in `tests/integration/`