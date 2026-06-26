"""drop_trigger_clasificaciones

Revision ID: 05ee35da0b05
Revises: fc0d37916141
Create Date: 2026-06-25 19:44:00.340141

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '05ee35da0b05'
down_revision: Union[str, None] = 'fc0d37916141'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Eliminamos la función PL/pgSQL con CASCADE para que también se elimine automáticamente el trigger atado a ella
    op.execute("DROP FUNCTION IF EXISTS actualizar_clasificaciones_paciente() CASCADE")


def downgrade() -> None:
    """Downgrade schema."""
    pass
