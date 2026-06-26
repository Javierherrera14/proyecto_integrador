from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Circunstancias_Ambientales
from typing import List
from app.schemas.circunstancias_ambientales import (
    CircunstanciasAmbientalesCreate,
    CircunstanciasAmbientalesUpdate,
    CircunstanciasAmbientalesResponse
)

router = APIRouter(prefix="/circunstancias_ambientales", tags=["circunstancias_ambientales"])

@router.post("/", response_model=CircunstanciasAmbientalesResponse)
def crear_circustancia_ambiental(documento: CircunstanciasAmbientalesCreate, db: Session = Depends(get_db)):
    db_documento = Circunstancias_Ambientales(**documento.model_dump())
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    return db_documento

@router.get("/", response_model=List[CircunstanciasAmbientalesResponse])
def obtener_documentos(db: Session = Depends(get_db)):
    documentos = db.query(Circunstancias_Ambientales).all()
    return documentos

@router.get("/{id}", response_model=CircunstanciasAmbientalesResponse)
def obtener_documento(id: int, db: Session = Depends(get_db)):
    documento = db.query(Circunstancias_Ambientales).filter(Circunstancias_Ambientales.id == id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Circunstancias ambientales no encontradas")
    return documento

@router.put("/{id}", response_model=CircunstanciasAmbientalesResponse)
def actualizar_documento(id: int, datos: CircunstanciasAmbientalesUpdate, db: Session = Depends(get_db)):
    documento = db.query(Circunstancias_Ambientales).filter(Circunstancias_Ambientales.id == id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Circunstancias ambientales no encontrada")

    for key, value in datos.model_dump(exclude_unset=True).items():
        setattr(documento, key, value)

    db.commit()
    db.refresh(documento)
    return documento

@router.delete("/{id}")
def eliminar_documento(id: int, db: Session = Depends(get_db)):
    documento = db.query(Circunstancias_Ambientales).filter(Circunstancias_Ambientales.id == id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Circunstancias ambientales no encontradas")

    db.delete(documento)
    db.commit()
    return {"mensaje": "Circunstancias ambientales eliminadas exitosamente"}
