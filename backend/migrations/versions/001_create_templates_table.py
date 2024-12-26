"""create templates table

Revision ID: 001
Revises: 
Create Date: 2024-12-23 16:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create enum types
    template_status = postgresql.ENUM('draft', 'active', 'archived', name='templatestatus')
    template_status.create(op.get_bind())

    # Create templates table
    op.create_table(
        'templates',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('version', sa.String(), nullable=False),
        sa.Column('status', sa.Enum('draft', 'active', 'archived', name='templatestatus'), nullable=False),
        sa.Column('sections', postgresql.JSON(), nullable=False),
        sa.Column('scoring', postgresql.JSON(), nullable=False),
        sa.Column('category_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_by', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('ix_templates_created_at', 'templates', ['created_at'])
    op.create_index('ix_templates_status', 'templates', ['status'])
    op.create_index('ix_templates_category_id', 'templates', ['category_id'])

def downgrade() -> None:
    # Drop indexes
    op.drop_index('ix_templates_created_at')
    op.drop_index('ix_templates_status')
    op.drop_index('ix_templates_category_id')

    # Drop table
    op.drop_table('templates')

    # Drop enum type
    op.execute('DROP TYPE templatestatus')