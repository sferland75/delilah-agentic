"""initial tables

Revision ID: 001
Revises: 
Create Date: 2024-12-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create clients table
    op.create_table(
        'clients',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('first_name', sa.String(), nullable=False),
        sa.Column('last_name', sa.String(), nullable=False),
        sa.Column('email', sa.String()),
        sa.Column('phone', sa.String()),
        sa.Column('date_of_birth', sa.DateTime()),
        sa.Column('emergency_contact', sa.String()),
        sa.Column('primary_diagnosis', sa.String()),
        sa.Column('notes', sa.String()),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'))
    )

    # Create therapists table
    op.create_table(
        'therapists',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('first_name', sa.String(), nullable=False),
        sa.Column('last_name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('phone', sa.String()),
        sa.Column('license_number', sa.String(), nullable=False),
        sa.Column('license_state', sa.String(), nullable=False),
        sa.Column('years_of_experience', sa.Integer()),
        sa.Column('assessment_count', sa.Integer(), default=0),
        sa.Column('rating', sa.Float(), default=0.0),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.UniqueConstraint('email', name='uq_therapist_email'),
        sa.UniqueConstraint('license_number', 'license_state', name='uq_therapist_license')
    )

    # Create assessments table
    op.create_table(
        'assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('client_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('clients.id')),
        sa.Column('therapist_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('therapists.id')),
        sa.Column('assessment_type', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('scheduled_date', sa.DateTime()),
        sa.Column('completion_date', sa.DateTime()),
        sa.Column('notes', sa.String()),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'))
    )

def downgrade():
    op.drop_table('assessments')
    op.drop_table('therapists')
    op.drop_table('clients')