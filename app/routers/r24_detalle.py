from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import R24Detalle
from pydantic import BaseModel
from typing import Optional
from datetime import time
from app.service.analisisBioquimicoService import calcular_y_guardar_analisis_bioquimico  # Importamos el servicio

router = APIRouter(prefix="/r24_detalle", tags=["r24_detalle"])

class R24DetalleCreate(BaseModel):
    id_r24: int
    tiempo_comida: str
    lugar: Optional[str] = None
    hora: Optional[time] = None
    preparacion: Optional[str] = None
    alimento_id: Optional[int] = None
    medida_casera: Optional[str] = None
    gramos_consumidos: Optional[float] = None

class R24DetalleUpdate(BaseModel):
    tiempo_comida: Optional[str] = None
    lugar: Optional[str] = None
    hora: Optional[time] = None
    preparacion: Optional[str] = None
    alimento_id: Optional[int] = None
    medida_casera: Optional[str] = None
    gramos_consumidos: Optional[float] = None

@router.post("/")
def crear_detalle(detalle: R24DetalleCreate, db: Session = Depends(get_db)):
    nuevo_detalle = R24Detalle(**detalle.dict())
    db.add(nuevo_detalle)
    db.commit()
    db.refresh(nuevo_detalle)

    try:
        calcular_y_guardar_analisis_bioquimico(db, nuevo_detalle.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo calcular análisis bioquímico: {str(e)}")

    return nuevo_detalle

@router.get("/")
def obtener_detalles(db: Session = Depends(get_db)):
    return db.query(R24Detalle).all()

@router.get("/{detalle_id}")
def obtener_detalle(detalle_id: int, db: Session = Depends(get_db)):
    detalle = db.query(R24Detalle).filter(R24Detalle.id == detalle_id).first()
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle R24 no encontrado")
    return detalle

@router.put("/{detalle_id}")
def actualizar_detalle(detalle_id: int, datos: R24DetalleUpdate, db: Session = Depends(get_db)):
    detalle = db.query(R24Detalle).filter(R24Detalle.id == detalle_id).first()
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle R24 no encontrado")

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(detalle, key, value)
    db.commit()

    try:
        calcular_y_guardar_analisis_bioquimico(db, detalle.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No se pudo recalcular análisis bioquímico: {str(e)}")

    return detalle

@router.delete("/{detalle_id}")
def eliminar_detalle(detalle_id: int, db: Session = Depends(get_db)):
    detalle = db.query(R24Detalle).filter(R24Detalle.id == detalle_id).first()
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle R24 no encontrado")
    db.delete(detalle)
    db.commit()
    return {"mensaje": "Detalle R24 eliminado"}
