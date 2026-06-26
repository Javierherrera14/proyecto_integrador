from pydantic import BaseModel, ConfigDict
from typing import Optional

class FrecuenciaConsumoBase(BaseModel):
    grupo_alimentos: str
    alimento: str
    consume_si: bool
    consume_no: bool
    consume_dia: bool
    frecuencia_dia: bool
    frecuencia_semana: bool
    frecuencia_mes: bool
    clasificacion_poco_frecuente: bool
    clasificacion_frecuente: bool
    clasificacion_muy_frecuente: bool

class FrecuenciaConsumoCreate(FrecuenciaConsumoBase):
    id_paciente: int

class FrecuenciaConsumoUpdate(BaseModel):
    grupo_alimentos: Optional[str] = None
    alimento: Optional[str] = None
    consume_si: Optional[bool] = None
    consume_no: Optional[bool] = None
    consume_dia: Optional[bool] = None
    frecuencia_dia: Optional[bool] = None
    frecuencia_semana: Optional[bool] = None
    frecuencia_mes: Optional[bool] = None
    clasificacion_poco_frecuente: Optional[bool] = None
    clasificacion_frecuente: Optional[bool] = None
    clasificacion_muy_frecuente: Optional[bool] = None

class FrecuenciaConsumoResponse(FrecuenciaConsumoBase):
    id: int
    id_paciente: int

    model_config = ConfigDict(from_attributes=True)
