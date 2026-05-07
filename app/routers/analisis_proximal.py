from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import AnalisisProximal
from app.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/analisis_proximal", tags=["Análisis Proximal"])

class AnalisisProximalBase(BaseModel):
    humedad: Optional[float]
    energia_kcal: Optional[float]
    energia_kj: Optional[float]
    proteina: Optional[float]
    lipidos: Optional[float]
    carbohidratos_total: Optional[float]
    carbohidratos_disponibles: Optional[float]
    fibra_dietetica: Optional[float]
    ceniza: Optional[float]

class AnalisisProximalCreate(AnalisisProximalBase):
    alimento_id: int

class AnalisisProximalOut(AnalisisProximalCreate):
    class Config:
        orm_mode = True

@router.post("/", response_model=AnalisisProximalOut)
def create_analisis(data: AnalisisProximalCreate, db: Session = Depends(get_db)):
    analisis = AnalisisProximal(**data.dict())
    db.add(analisis)
    db.commit()
    db.refresh(analisis)
    return analisis

@router.get("/{alimento_id}", response_model=AnalisisProximalOut)
def get_analisis(alimento_id: int, db: Session = Depends(get_db)):
    analisis = db.query(AnalisisProximal).filter(AnalisisProximal.alimento_id == alimento_id).first()
    if not analisis:
        raise HTTPException(status_code=404, detail="Análisis no encontrado")
    return analisis

@router.put("/{alimento_id}", response_model=AnalisisProximalOut)
def update_analisis(alimento_id: int, data: AnalisisProximalBase, db: Session = Depends(get_db)):
    analisis = db.query(AnalisisProximal).filter(AnalisisProximal.alimento_id == alimento_id).first()
    if not analisis:
        raise HTTPException(status_code=404, detail="Análisis no encontrado")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(analisis, key, value)
    db.commit()
    db.refresh(analisis)
    return analisis

@router.delete("/{alimento_id}")
def delete_analisis(alimento_id: int, db: Session = Depends(get_db)):
    analisis = db.query(AnalisisProximal).filter(AnalisisProximal.alimento_id == alimento_id).first()
    if not analisis:
        raise HTTPException(status_code=404, detail="Análisis no encontrado")
    db.delete(analisis)
    db.commit()
    return {"detail": "Análisis eliminado exitosamente"}
