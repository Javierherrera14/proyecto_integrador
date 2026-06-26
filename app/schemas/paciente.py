from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.evaluacion_antropometrica import EvaluacionAntropometricaResponse

# Base común para creación y respuesta
class PacienteBase(BaseModel):
    nombre_completo: str
    edad: int
    sexo: str
    telefono: str
    direccion: str

# Esquema para creación
class PacienteCreate(PacienteBase):
    usuario_id: int

# Esquema para actualización parcial
class PacienteUpdate(BaseModel):
    nombre_completo: Optional[str] = None
    edad: Optional[int] = None
    sexo: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    clasificacion_imc: Optional[str] = None
    clasificacion_circunferencia: Optional[str] = None

# Esquema para respuesta completa
class PacienteResponse(PacienteBase):
    id: int
    fecha_registro: datetime
    clasificacion_imc: Optional[str] = None
    clasificacion_circunferencia: Optional[str] = None
    evaluaciones_antropometricas: List[EvaluacionAntropometricaResponse] = []

    class Config:
        orm_mode = True
