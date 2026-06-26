from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Frecuencia_Consumo_Alimentos
from typing import List
from app.schemas.frecuencia_consumo_alimentos import (
    FrecuenciaConsumoCreate,
    FrecuenciaConsumoUpdate,
    FrecuenciaConsumoResponse
)

router = APIRouter(prefix="/frecuencia_consumo_alimentos", tags=["frecuencia_consumo_alimentos"])

@router.post("/", response_model=FrecuenciaConsumoResponse)
def crear_frecuencia_consumo(datos: FrecuenciaConsumoCreate, db: Session = Depends(get_db)):
    db_item = Frecuencia_Consumo_Alimentos(**datos.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[FrecuenciaConsumoResponse])
def obtener_todos(db: Session = Depends(get_db)):
    return db.query(Frecuencia_Consumo_Alimentos).all()

@router.get("/{item_id}", response_model=FrecuenciaConsumoResponse)
def obtener_por_id(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Frecuencia_Consumo_Alimentos).filter(Frecuencia_Consumo_Alimentos.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return item

@router.put("/{item_id}", response_model=FrecuenciaConsumoResponse)
def actualizar(item_id: int, nuevos_datos: FrecuenciaConsumoUpdate, db: Session = Depends(get_db)):
    item = db.query(Frecuencia_Consumo_Alimentos).filter(Frecuencia_Consumo_Alimentos.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Registro no encontrado")

    for key, value in nuevos_datos.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def eliminar(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Frecuencia_Consumo_Alimentos).filter(Frecuencia_Consumo_Alimentos.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    
    db.delete(item)
    db.commit()
    return {"mensaje": "Registro eliminado exitosamente"}
