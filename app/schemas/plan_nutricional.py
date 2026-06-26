from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Propiedades para la solicitud de generación desde el frontend
class PlanNutricionalGenerateRequest(BaseModel):
    paciente_id: int
    objetivo: str

# Propiedades compartidas
class PlanNutricionalBase(BaseModel):
    objetivo: str
    contenido: str
    evaluacion: Optional[str] = None

# Propiedades para recibir en la creación manual (si llegaras a necesitarlo)
class PlanNutricionalCreate(PlanNutricionalBase):
    id_paciente: int

# Propiedades para enviar de respuesta (GET, POST Response)
class PlanNutricionalResponse(PlanNutricionalBase):
    id: int
    id_paciente: int
    fecha_creacion: datetime

    class Config:
        orm_mode = True