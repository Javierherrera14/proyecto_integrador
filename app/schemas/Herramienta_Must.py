from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class HerramientaMustBase(BaseModel):
    id_paciente: int
    imc: float
    puntaje_imc: int
    perdida_peso_porcentaje: float
    puntaje_perdida_peso: int
    efecto_enfermedad: bool
    puntaje_efecto_enfermedad: int
    puntaje_total: int
    clasificacion_riesgo: str
    recomendaciones: str
    fecha_evaluacion: Optional[datetime] = None


class HerramientaMustCreate(HerramientaMustBase):
    pass


class HerramientaMustUpdate(BaseModel):
    imc: Optional[float] = None
    puntaje_imc: Optional[int] = None
    perdida_peso_porcentaje: Optional[float] = None
    puntaje_perdida_peso: Optional[int] = None
    efecto_enfermedad: Optional[bool] = None
    puntaje_efecto_enfermedad: Optional[int] = None
    puntaje_total: Optional[int] = None
    clasificacion_riesgo: Optional[str] = None
    recomendaciones: Optional[str] = None


class HerramientaMust(HerramientaMustBase):
    id: int

class Config:
    from_attributes = True
