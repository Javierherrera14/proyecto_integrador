from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import EvaluacionAntropometrica, Paciente
from app.schemas.evaluacion_antropometrica import (
    EvaluacionAntropometricaCreate,
    EvaluacionAntropometricaUpdate,
    EvaluacionAntropometricaResponse
)

router = APIRouter(prefix="/evaluacion_antropometrica", tags=["evaluacion_antropometrica"])

def calcular_clasificaciones(imc: float, sexo: str, cintura: float) -> tuple[str, str]:
    clasificacion_imc = "Normal"
    if imc < 18.5:
        clasificacion_imc = "Bajo peso"
    elif 18.5 <= imc < 25:
        clasificacion_imc = "Normal"
    elif 25 <= imc < 30:
        clasificacion_imc = "Sobrepeso"
    elif imc >= 30:
        clasificacion_imc = "Obesidad"

    clasificacion_circunferencia = "Bajo riesgo"
    if sexo.lower() == "masculino":
        if cintura > 102:
            clasificacion_circunferencia = "Riesgo sustancialmente incrementado"
        elif cintura > 94:
            clasificacion_circunferencia = "Riesgo incrementado"
    elif sexo.lower() == "femenino":
        if cintura > 88:
            clasificacion_circunferencia = "Riesgo sustancialmente incrementado"
        elif cintura > 80:
            clasificacion_circunferencia = "Riesgo incrementado"

    return clasificacion_imc, clasificacion_circunferencia

@router.post("/", response_model=EvaluacionAntropometricaResponse)
def crear_evaluacion(
    evaluacion: EvaluacionAntropometricaCreate,
    db: Session = Depends(get_db)
):
    try:
        nueva_eval = EvaluacionAntropometrica(**evaluacion.model_dump())
        paciente = db.query(Paciente).filter(Paciente.id == evaluacion.id_paciente).first()
        
        # Calcular IMC y clasificaciones y guardarlas directamente en los modelos SQLAlchemy
        if paciente and nueva_eval.talla > 0 and nueva_eval.peso_actual > 0:
            talla_m = nueva_eval.talla / 100.0 if nueva_eval.talla > 3 else nueva_eval.talla
            nueva_eval.ind_masa_corporal = round(nueva_eval.peso_actual / (talla_m ** 2), 2)
            
            clas_imc, clas_cint = calcular_clasificaciones(
                nueva_eval.ind_masa_corporal, 
                paciente.sexo, 
                nueva_eval.circunferencia_cintura
            )
            paciente.clasificacion_imc = clas_imc
            paciente.clasificacion_circunferencia = clas_cint
            db.add(paciente) # Asegurar que el cambio del paciente se trackee

        db.add(nueva_eval)
        db.commit()
        db.refresh(nueva_eval)
        return nueva_eval
    except Exception as e:
        print("❌ ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[EvaluacionAntropometricaResponse])
def obtener_evaluaciones(
    id_paciente: int = Query(...),
    db: Session = Depends(get_db)
):
    return (
        db.query(EvaluacionAntropometrica)
        .filter(EvaluacionAntropometrica.id_paciente == id_paciente)
        .order_by(EvaluacionAntropometrica.fecha_registro.desc())
        .all()
    )

@router.get("/{eval_id}", response_model=EvaluacionAntropometricaResponse)
def obtener_evaluacion(eval_id: int, db: Session = Depends(get_db)):
    evaluacion = db.query(EvaluacionAntropometrica).filter(EvaluacionAntropometrica.id == eval_id).first()
    if not evaluacion:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")
    return evaluacion

@router.put("/{eval_id}", response_model=EvaluacionAntropometricaResponse)
def actualizar_evaluacion(eval_id: int, datos: EvaluacionAntropometricaUpdate, db: Session = Depends(get_db)):
    evaluacion = db.query(EvaluacionAntropometrica).filter(EvaluacionAntropometrica.id == eval_id).first()
    if not evaluacion:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")

    for key, value in datos.model_dump(exclude_unset=True).items():
        setattr(evaluacion, key, value)

    db.commit()
    db.refresh(evaluacion)
    return evaluacion

@router.delete("/{eval_id}")
def eliminar_evaluacion(eval_id: int, db: Session = Depends(get_db)):
    evaluacion = db.query(EvaluacionAntropometrica).filter(EvaluacionAntropometrica.id == eval_id).first()
    if not evaluacion:
        raise HTTPException(status_code=404, detail="Evaluación no encontrada")
    
    db.delete(evaluacion)
    db.commit()
    return {"mensaje": "Evaluación eliminada permanentemente"}
