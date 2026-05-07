from pydantic import BaseModel

class PlanNutricionalRequest(BaseModel):
    paciente_id: int
    objetivo: str

class PlanNutricionalRespuesta(BaseModel):
    plan_simplificado: str
    evaluacion: str
