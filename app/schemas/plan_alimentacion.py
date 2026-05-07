from pydantic import BaseModel

class PlanRequest(BaseModel):
    paciente_id: int
    objetivo: str
