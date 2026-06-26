from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class EvaluacionAntropometricaBase(BaseModel):
    peso_actual: float
    peso_usual: float
    talla: int
    circunferencia_cintura: int
    ind_masa_corporal: float

class EvaluacionAntropometricaCreate(EvaluacionAntropometricaBase):
    id_paciente: int

class EvaluacionAntropometricaUpdate(BaseModel):
    peso_actual: Optional[float] = None
    peso_usual: Optional[float] = None
    talla: Optional[int] = None
    circunferencia_cintura: Optional[int] = None
    ind_masa_corporal: Optional[float] = None

class EvaluacionAntropometricaResponse(EvaluacionAntropometricaBase):
    id: int
    id_paciente: int
    fecha_registro: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
