from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Antecedentes_Patologicos
from app.schemas.antecedentes_patologicos import (
    AntecedentesPatologicosCreate,
    AntecedentesPatologicosUpdate,
    AntecedentesPatologicosResponse
)
from typing import List

router = APIRouter(prefix="/antecedentes_patologicos", tags=["antecedentes_patologicos"])

@router.post("/", response_model=AntecedentesPatologicosResponse)
def crear_antecedente(documento: AntecedentesPatologicosCreate, db: Session = Depends(get_db)):
    db_documento = Antecedentes_Patologicos(**documento.model_dump())
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    return db_documento

@router.get("/", response_model=List[AntecedentesPatologicosResponse])
def obtener_documentos(db: Session = Depends(get_db)):
    documentos = db.query(Antecedentes_Patologicos).all()
    return documentos

@router.get("/{antecedente_id}", response_model=AntecedentesPatologicosResponse)
def obtener_documento(antecedente_id: int, db: Session = Depends(get_db)):
    documento = db.query(Antecedentes_Patologicos).filter(Antecedentes_Patologicos.id == antecedente_id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Antecedente no encontrado")
    return documento

@router.put("/{antecedente_id}", response_model=AntecedentesPatologicosResponse)
def actualizar_documento(antecedente_id: int, datos: AntecedentesPatologicosUpdate, db: Session = Depends(get_db)):
    documento = db.query(Antecedentes_Patologicos).filter(Antecedentes_Patologicos.id == antecedente_id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Antecedente no encontrado")

    for key, value in datos.model_dump(exclude_unset=True).items():
        setattr(documento, key, value)

    db.commit()
    db.refresh(documento)
    return documento

@router.delete("/{antecedente_id}")
def eliminar_documento(antecedente_id: int, db: Session = Depends(get_db)):
    documento = db.query(Antecedentes_Patologicos).filter(Antecedentes_Patologicos.id == antecedente_id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    db.delete(documento)
    db.commit()
    return {"mensaje": "Antecedente patologico eliminado exitosamente"}
