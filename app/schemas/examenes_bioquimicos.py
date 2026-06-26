from pydantic import BaseModel, ConfigDict
from typing import Optional
from decimal import Decimal

class ExamenBioquimicoBase(BaseModel):
    hemoglobina_glicada: Decimal
    glicemia_basal: int
    colesterol_total: int
    colesterol_hdl: int
    colesterol_ldl: int
    trigliceridos: int
    creatinina: Decimal
    interpretacion_hemoglobina: str
    interpretacion_glicemia: str
    interpretacion_colesterol_total: str
    interpretacion_colesterol_hdl: str
    interpretacion_colesterol_ldl: str
    interpretacion_trigliceridos: str
    interpretacion_creatinina: str

class ExamenBioquimicoCreate(ExamenBioquimicoBase):
    id_paciente: int

class ExamenBioquimicoUpdate(BaseModel):
    hemoglobina_glicada: Optional[Decimal] = None
    glicemia_basal: Optional[int] = None
    colesterol_total: Optional[int] = None
    colesterol_hdl: Optional[int] = None
    colesterol_ldl: Optional[int] = None
    trigliceridos: Optional[int] = None
    creatinina: Optional[Decimal] = None
    interpretacion_hemoglobina: Optional[str] = None
    interpretacion_glicemia: Optional[str] = None
    interpretacion_colesterol_total: Optional[str] = None
    interpretacion_colesterol_hdl: Optional[str] = None
    interpretacion_colesterol_ldl: Optional[str] = None
    interpretacion_trigliceridos: Optional[str] = None
    interpretacion_creatinina: Optional[str] = None

class ExamenBioquimicoResponse(ExamenBioquimicoBase):
    id: int
    id_paciente: int

    model_config = ConfigDict(from_attributes=True)
