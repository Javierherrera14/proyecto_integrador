"""Drop_Antropometria_from_Paciente

Revision ID: fc0d37916141
Revises: d9596b1d48fe
Create Date: 2026-06-25 18:53:41.108378

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fc0d37916141'
down_revision: Union[str, None] = 'd9596b1d48fe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('pacientes', 'peso_actual')
    op.drop_column('pacientes', 'peso_usual')
    op.drop_column('pacientes', 'talla')
    op.drop_column('pacientes', 'circunferencia_cintura')
    op.drop_column('pacientes', 'ind_masa_corporal')
    """Upgrade schema."""


def downgrade() -> None:
    op.add_column('pacientes', sa.Column('peso_actual', sa.Float(), nullable=True))
    op.add_column('pacientes', sa.Column('peso_usual', sa.Float(), nullable=True))
    op.add_column('pacientes', sa.Column('talla', sa.Integer(), nullable=True))
    op.add_column('pacientes', sa.Column('circunferencia_cintura', sa.Integer(), nullable=True))
    op.add_column('pacientes', sa.Column('ind_masa_corporal', sa.Float(), nullable=True))
    """Downgrade schema."""
