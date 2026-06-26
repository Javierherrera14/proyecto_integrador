from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PlanRequest(BaseModel):
    paciente_id: int
    objetivo: str

class PlanNutricionalResponse(BaseModel):
    id: int
    id_paciente: int
    objetivo: str
    contenido: str
    fecha_creacion: datetime

    model_config = ConfigDict(from_attributes=True)
