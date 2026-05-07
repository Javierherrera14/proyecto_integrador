from fastapi import APIRouter, HTTPException
from app.service.gemini_plan_service import generar_plan_nutricional_con_gemini
from app.schemas.plan_alimentacion import PlanRequest

router = APIRouter(
    prefix="/plan-alimentacion",
    tags=["Plan Alimentación"]
)

@router.post("/generar")
def generar_plan(request: PlanRequest):
    try:
        print(f"Generando plan para paciente {request.paciente_id} con objetivo '{request.objetivo}'")
        plan = generar_plan_nutricional_con_gemini(request.paciente_id, request.objetivo)
        if not plan or not isinstance(plan, str) or len(plan.strip()) == 0:
            raise ValueError("El plan generado está vacío o es inválido.")
        return {"plan_alimentacion": plan}
    except Exception as e:
        print(f"Error al generar plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al generar plan: {str(e)}")

