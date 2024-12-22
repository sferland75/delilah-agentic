"""add learning metrics

Revision ID: 20241221_001
Revises: previous_revision_id
Create Date: 2024-12-21
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSON


# revision identifiers, used by Alembic
revision = '20241221_001'
down_revision = 'previous_revision_id'  # Update this to your previous migration
branch_labels = None
depends_on = None


def upgrade():
    # Create learning_metrics table
    op.create_table(
        'learning_metrics',
        sa.Column('id', UUID, primary_key=True),
        sa.Column('agent_id', UUID, nullable=False),
        sa.Column('metric_type', sa.String(), nullable=False),
        sa.Column('value', sa.Float(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('metadata', JSON, nullable=True)
    )

    # Create pattern_metrics table
    op.create_table(
        'pattern_metrics',
        sa.Column('id', UUID, primary_key=True),
        sa.Column('agent_id', UUID, nullable=False),
        sa.Column('pattern_id', UUID, nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('usage_count', sa.Integer(), default=0),
        sa.Column('success_rate', sa.Float(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('metadata', JSON, nullable=True)
    )

    # Create indexes
    op.create_index(
        'idx_learning_metrics_timestamp',
        'learning_metrics',
        ['timestamp']
    )
    op.create_index(
        'idx_learning_metrics_agent_timestamp',
        'learning_metrics',
        ['agent_id', 'timestamp']
    )
    op.create_index(
        'idx_pattern_metrics_confidence',
        'pattern_metrics',
        ['confidence']
    )
    op.create_index(
        'idx_pattern_metrics_agent_timestamp',
        'pattern_metrics',
        ['agent_id', 'timestamp']
    )

    # Create unique constraint
    op.create_unique_constraint(
        'uq_agent_pattern',
        'pattern_metrics',
        ['agent_id', 'pattern_id']
    )


def downgrade():
    # Drop unique constraint
    op.drop_constraint('uq_agent_pattern', 'pattern_metrics')

    # Drop indexes
    op.drop_index('idx_pattern_metrics_agent_timestamp')
    op.drop_index('idx_pattern_metrics_confidence')
    op.drop_index('idx_learning_metrics_agent_timestamp')
    op.drop_index('idx_learning_metrics_timestamp')

    # Drop tables
    op.drop_table('pattern_metrics')
    op.drop_table('learning_metrics')