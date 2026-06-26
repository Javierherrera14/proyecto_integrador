from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Examenes_Bioquimicos
from typing import List
from app.schemas.examenes_bioquimicos import (
    ExamenBioquimicoCreate,
    ExamenBioquimicoUpdate,
    ExamenBioquimicoResponse
)

router = APIRouter(prefix="/examenes_bioquimicos", tags=["examenes_bioquimicos"])

@router.post("/", response_model=ExamenBioquimicoResponse)
def crear_examen_bioquimico(datos: ExamenBioquimicoCreate, db: Session = Depends(get_db)):
    nuevo_examen = Examenes_Bioquimicos(**datos.model_dump())
    db.add(nuevo_examen)
    db.commit()
    db.refresh(nuevo_examen)
    return nuevo_examen

@router.get("/", response_model=List[ExamenBioquimicoResponse])
def obtener_todos_examenes_bioquimicos(db: Session = Depends(get_db)):
    return db.query(Examenes_Bioquimicos).all()

@router.get("/{examen_id}", response_model=ExamenBioquimicoResponse)
def obtener_examen_bioquimico_por_id(examen_id: int, db: Session = Depends(get_db)):
    examen = db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen bioquímico no encontrado")
    return examen

@router.get("/paciente/{paciente_id}", response_model=List[ExamenBioquimicoResponse])
def obtener_examenes_por_paciente(paciente_id: int, db: Session = Depends(get_db)):
    return db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id_paciente == paciente_id).all()

@router.put("/{examen_id}", response_model=ExamenBioquimicoResponse)
def actualizar_examen_bioquimico(examen_id: int, datos: ExamenBioquimicoUpdate, db: Session = Depends(get_db)):
    examen = db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen bioquímico no encontrado")

    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(examen, campo, valor)

    db.commit()
    db.refresh(examen)
    return examen

@router.delete("/{examen_id}")
def eliminar_examen_bioquimico(examen_id: int, db: Session = Depends(get_db)):
    examen = db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen bioquímico no encontrado")

    db.delete(examen)
    db.commit()
    return {"mensaje": "Examen bioquímico eliminado exitosamente"}
