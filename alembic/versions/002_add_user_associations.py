"""add user associations

Revision ID: 002_add_user_associations
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSON

def upgrade():
    # Create patients table
    op.create_table(
        'patients',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('date_of_birth', sa.DateTime(), nullable=False),
        sa.Column('gender', sa.String()),
        sa.Column('medical_history', JSON),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'))
    )

    # Add user associations to assessments
    op.add_column('assessments', sa.Column('created_by_id', UUID(as_uuid=True)))
    op.add_column('assessments', sa.Column('reviewed_by_id', UUID(as_uuid=True)))
    op.add_column('assessments', sa.Column('patient_id', UUID(as_uuid=True)))
    
    op.create_foreign_key('fk_assessment_creator', 'assessments', 'users',
                         ['created_by_id'], ['id'])
    op.create_foreign_key('fk_assessment_reviewer', 'assessments', 'users',
                         ['reviewed_by_id'], ['id'])
    op.create_foreign_key('fk_assessment_patient', 'assessments', 'patients',
                         ['patient_id'], ['id'])

def downgrade():
    op.drop_constraint('fk_assessment_creator', 'assessments')
    op.drop_constraint('fk_assessment_reviewer', 'assessments')
    op.drop_constraint('fk_assessment_patient', 'assessments')
    
    op.drop_column('assessments', 'created_by_id')
    op.drop_column('assessments', 'reviewed_by_id')
    op.drop_column('assessments', 'patient_id')
    
    op.drop_table('patients')