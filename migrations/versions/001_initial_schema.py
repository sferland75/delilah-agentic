"""initial schema

Revision ID: 001
Revises: 
Create Date: 2024-12-12

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Assessment Types enum
    op.execute("""
        CREATE TYPE assessment_type AS ENUM (
            'Activities of Daily Living',
            'Instrumental Activities of Daily Living',
            'Cognitive Assessment',
            'Physical Assessment',
            'Sensory Assessment'
        )
    """)
    
    # Assessment Status enum
    op.execute("""
        CREATE TYPE assessment_status AS ENUM (
            'in_progress',
            'completed',
            'cancelled'
        )
    """)
    
    # Assessments table
    op.create_table(
        'assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('client_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('clients.id'), nullable=False),
        sa.Column('therapist_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('therapists.id'), nullable=False),
        sa.Column('type', sa.Enum('assessment_type', native_enum=False), nullable=False),
        sa.Column('status', sa.Enum('assessment_status', native_enum=False), nullable=False),
        sa.Column('current_step', sa.Integer, default=0),
        sa.Column('steps_data', postgresql.JSONB, default={}),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
    )
    
    # Assessment Messages table
    op.create_table(
        'assessment_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('assessment_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('assessments.id'), nullable=False),
        sa.Column('type', sa.String, nullable=False),
        sa.Column('payload', postgresql.JSONB, nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
    )
    
    # Indices
    op.create_index('idx_assessments_client', 'assessments', ['client_id'])
    op.create_index('idx_assessments_therapist', 'assessments', ['therapist_id'])
    op.create_index('idx_assessment_messages_assessment', 'assessment_messages', ['assessment_id'])

def downgrade() -> None:
    op.drop_index('idx_assessment_messages_assessment')
    op.drop_index('idx_assessments_therapist')
    op.drop_index('idx_assessments_client')
    
    op.drop_table('assessment_messages')
    op.drop_table('assessments')
    
    op.execute('DROP TYPE assessment_status')
    op.execute('DROP TYPE assessment_type')
