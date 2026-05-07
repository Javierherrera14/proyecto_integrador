from fastapi import APIRouter
from app.schemas.plan_nutricional import PlanNutricionalRequest, PlanNutricionalRespuesta
from app.service.multiagent_plan_service import generar_plan_multiagente

router = APIRouter(prefix="/plan", tags=["plan nutricional"])

@router.post("/", response_model=PlanNutricionalRespuesta)
def generar_plan_route(data: PlanNutricionalRequest):
    resultado = generar_plan_multiagente(data.paciente_id, data.objetivo)
    return resultado
