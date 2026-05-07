from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Paciente
from app.schemas.paciente import PacienteCreate, PacienteUpdate, PacienteResponse
from datetime import datetime
from typing import List

router = APIRouter(prefix="/pacientes", tags=["pacientes"])

# ✅ Crear paciente con usuario_id
@router.post("/", response_model=PacienteResponse)
def crear_paciente(
    paciente: PacienteCreate,
    db: Session = Depends(get_db)
):
    try:
        nuevo_paciente = Paciente(**paciente.dict())
        db.add(nuevo_paciente)
        db.commit()
        db.refresh(nuevo_paciente)
        return nuevo_paciente
    except Exception as e:
        print("❌ ERROR al crear paciente:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Obtener pacientes filtrando por usuario_id y activos
@router.get("/", response_model=List[PacienteResponse])
def obtener_pacientes(
    usuario_id: int = Query(...),
    db: Session = Depends(get_db)
):
    return (
        db.query(Paciente)
        .filter(Paciente.usuario_id == usuario_id, Paciente.activo == True)
        .all()
    )


# ✅ Obtener un solo paciente
@router.get("/{paciente_id}", response_model=PacienteResponse)
def obtener_paciente(paciente_id: int, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return paciente


# ✅ Actualizar paciente
@router.put("/{paciente_id}", response_model=PacienteResponse)
def actualizar_paciente(paciente_id: int, datos: PacienteUpdate, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(paciente, key, value)

    db.commit()
    db.refresh(paciente)
    return paciente


# ✅ Eliminar paciente (lógica o permanente)
@router.delete("/{paciente_id}")
def eliminar_paciente(
    paciente_id: int,
    eliminar_definitivo: bool = Query(False),
    db: Session = Depends(get_db)
):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    if eliminar_definitivo:
        db.delete(paciente)
        db.commit()
        return {"mensaje": "Paciente eliminado permanentemente"}
    else:
        paciente.activo = False
        db.commit()
        return {"mensaje": "Paciente desactivado (eliminación lógica)"}
