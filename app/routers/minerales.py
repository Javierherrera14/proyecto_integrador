from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import Minerales
from app.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/minerales", tags=["Minerales"])

class MineralesBase(BaseModel):
    calcio: Optional[float]
    hierro: Optional[float]
    sodio: Optional[float]
    fosforo: Optional[float]
    yodo: Optional[float]
    zinc: Optional[float]
    magnezio: Optional[float]
    potasio: Optional[float]

class MineralesCreate(MineralesBase):
    alimento_id: int

class MineralesOut(MineralesCreate):
    class Config:
        orm_mode = True

@router.post("/", response_model=MineralesOut)
def create_minerales(data: MineralesCreate, db: Session = Depends(get_db)):
    minerales = Minerales(**data.dict())
    db.add(minerales)
    db.commit()
    db.refresh(minerales)
    return minerales

@router.get("/{alimento_id}", response_model=MineralesOut)
def get_minerales(alimento_id: int, db: Session = Depends(get_db)):
    minerales = db.query(Minerales).filter(Minerales.alimento_id == alimento_id).first()
    if not minerales:
        raise HTTPException(status_code=404, detail="Minerales no encontrados")
    return minerales

@router.put("/{alimento_id}", response_model=MineralesOut)
def update_minerales(alimento_id: int, data: MineralesBase, db: Session = Depends(get_db)):
    minerales = db.query(Minerales).filter(Minerales.alimento_id == alimento_id).first()
    if not minerales:
        raise HTTPException(status_code=404, detail="Minerales no encontrados")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(minerales, key, value)
    db.commit()
    db.refresh(minerales)
    return minerales

@router.delete("/{alimento_id}")
def delete_minerales(alimento_id: int, db: Session = Depends(get_db)):
    minerales = db.query(Minerales).filter(Minerales.alimento_id == alimento_id).first()
    if not minerales:
        raise HTTPException(status_code=404, detail="Minerales no encontrados")
    db.delete(minerales)
    db.commit()
    return {"detail": "Minerales eliminados exitosamente"}
