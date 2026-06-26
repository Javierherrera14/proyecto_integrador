"""Agrega tabla planes_nutricionales

Revision ID: b1e3f71afe89
Revises: 
Create Date: 2026-05-20 18:09:52.352492

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b1e3f71afe89'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('planes_nutricionales',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('id_paciente', sa.Integer(), nullable=False),
        sa.Column('objetivo', sa.String(), nullable=False),
        sa.Column('contenido', sa.Text(), nullable=False),
        sa.Column('evaluacion', sa.Text(), nullable=True),
        sa.Column('fecha_creacion', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['id_paciente'], ['pacientes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_planes_nutricionales_id'), 'planes_nutricionales', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_planes_nutricionales_id'), table_name='planes_nutricionales')
    op.drop_table('planes_nutricionales')
