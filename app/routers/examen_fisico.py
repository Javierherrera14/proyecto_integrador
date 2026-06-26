from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.models.models import Examen_Fisico
from app.database import get_db
from app.schemas.examen_fisico import (
    ExamenFisicoCreate,
    ExamenFisicoUpdate,
    ExamenFisicoResponse
)

router = APIRouter(prefix="/examen_fisico", tags=["Examen Físico"])

@router.get("/", response_model=List[ExamenFisicoResponse])
def get_all_examenes_fisicos(db: Session = Depends(get_db)):
    return db.query(Examen_Fisico).all()

@router.get("/{id}", response_model=ExamenFisicoResponse)
def get_examen_fisico(id: int, db: Session = Depends(get_db)):
    examen = db.query(Examen_Fisico).filter(Examen_Fisico.id == id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen físico no encontrado")
    return examen

@router.post("/", response_model=ExamenFisicoResponse)
def create_examen_fisico(examen: ExamenFisicoCreate, db: Session = Depends(get_db)):
    db_examen = Examen_Fisico(**examen.model_dump())
    db.add(db_examen)
    db.commit()
    db.refresh(db_examen)
    return db_examen

@router.put("/{id}", response_model=ExamenFisicoResponse)
def update_examen_fisico(id: int, updated_data: ExamenFisicoUpdate, db: Session = Depends(get_db)):
    examen = db.query(Examen_Fisico).filter(Examen_Fisico.id == id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen físico no encontrado")
    for key, value in updated_data.model_dump(exclude_unset=True).items():
        setattr(examen, key, value)
    db.commit()
    db.refresh(examen)
    return examen

@router.delete("/{id}")
def delete_examen_fisico(id: int, db: Session = Depends(get_db)):
    examen = db.query(Examen_Fisico).filter(Examen_Fisico.id == id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen físico no encontrado")
    db.delete(examen)
    db.commit()
    return {"message": "Examen físico eliminado correctamente"}
