"""Add_EvaluacionAntropometrica_and_Dates

Revision ID: d9596b1d48fe
Revises: b1e3f71afe89
Create Date: 2026-06-25 18:43:05.657793

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd9596b1d48fe'
down_revision: Union[str, None] = 'b1e3f71afe89'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('evaluacion_antropometrica',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('id_paciente', sa.Integer(), nullable=False),
    sa.Column('peso_actual', sa.Float(), nullable=False),
    sa.Column('peso_usual', sa.Float(), nullable=False),
    sa.Column('talla', sa.Integer(), nullable=False),
    sa.Column('circunferencia_cintura', sa.Integer(), nullable=False),
    sa.Column('ind_masa_corporal', sa.Float(), nullable=False),
    sa.Column('fecha_registro', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['id_paciente'], ['pacientes.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_evaluacion_antropometrica_id'), 'evaluacion_antropometrica', ['id'], unique=False)

    op.add_column('antecedentes_patologicos', sa.Column('fecha_registro', sa.DateTime(), nullable=True))
    op.add_column('circunstancias_ambientales', sa.Column('fecha_registro', sa.DateTime(), nullable=True))
    op.add_column('datos_alimentarios', sa.Column('fecha_registro', sa.DateTime(), nullable=True))
    op.add_column('examen_fisico', sa.Column('fecha_registro', sa.DateTime(), nullable=True))
    op.add_column('examenes_bioquimicos', sa.Column('fecha_registro', sa.DateTime(), nullable=True))
    op.add_column('frecuencia_consumo_alimentos', sa.Column('fecha_registro', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('frecuencia_consumo_alimentos', 'fecha_registro')
    op.drop_column('examenes_bioquimicos', 'fecha_registro')
    op.drop_column('examen_fisico', 'fecha_registro')
    op.drop_column('datos_alimentarios', 'fecha_registro')
    op.drop_column('circunstancias_ambientales', 'fecha_registro')
    op.drop_column('antecedentes_patologicos', 'fecha_registro')
    op.drop_index(op.f('ix_evaluacion_antropometrica_id'), table_name='evaluacion_antropometrica')
    op.drop_table('evaluacion_antropometrica')
