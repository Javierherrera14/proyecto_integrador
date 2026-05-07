from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Base común para creación y respuesta
class PacienteBase(BaseModel):
    nombre_completo: str
    edad: int
    sexo: str
    telefono: str
    direccion: str
    peso_actual: float
    peso_usual: float
    talla: int
    circunferencia_cintura: int
    ind_masa_corporal: float

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
    peso_actual: Optional[float] = None
    peso_usual: Optional[float] = None
    talla: Optional[int] = None
    circunferencia_cintura: Optional[int] = None
    ind_masa_corporal: Optional[float] = None  # ✅ corregido
    clasificacion_imc: Optional[str] = None
    clasificacion_circunferencia: Optional[str] = None

# Esquema para respuesta completa
class PacienteResponse(PacienteBase):
    id: int
    fecha_registro: datetime
    clasificacion_imc: Optional[str] = None
    clasificacion_circunferencia: Optional[str] = None

    class Config:
        orm_mode = True
