from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import AcidosGrasosColesterol
from app.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/acidos_grasos_colesterol", tags=["Ácidos Grasos y Colesterol"])

class AcidosGrasosBase(BaseModel):
    grasa_saturada: Optional[float]
    grasa_monoinsaturada: Optional[float]
    grasa_poliinsaturada: Optional[float]
    colesterol_mg: Optional[float]

class AcidosGrasosCreate(AcidosGrasosBase):
    alimento_id: int

class AcidosGrasosOut(AcidosGrasosCreate):
    class Config:
        orm_mode = True

@router.post("/", response_model=AcidosGrasosOut)
def create_acidos(data: AcidosGrasosCreate, db: Session = Depends(get_db)):
    acido = AcidosGrasosColesterol(**data.dict())
    db.add(acido)
    db.commit()
    db.refresh(acido)
    return acido

@router.get("/{alimento_id}", response_model=AcidosGrasosOut)
def get_acidos(alimento_id: int, db: Session = Depends(get_db)):
    acido = db.query(AcidosGrasosColesterol).filter(AcidosGrasosColesterol.alimento_id == alimento_id).first()
    if not acido:
        raise HTTPException(status_code=404, detail="Datos no encontrados")
    return acido

@router.put("/{alimento_id}", response_model=AcidosGrasosOut)
def update_acidos(alimento_id: int, data: AcidosGrasosBase, db: Session = Depends(get_db)):
    acido = db.query(AcidosGrasosColesterol).filter(AcidosGrasosColesterol.alimento_id == alimento_id).first()
    if not acido:
        raise HTTPException(status_code=404, detail="Datos no encontrados")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(acido, key, value)
    db.commit()
    db.refresh(acido)
    return acido

@router.delete("/{alimento_id}")
def delete_acidos(alimento_id: int, db: Session = Depends(get_db)):
    acido = db.query(AcidosGrasosColesterol).filter(AcidosGrasosColesterol.alimento_id == alimento_id).first()
    if not acido:
        raise HTTPException(status_code=404, detail="Datos no encontrados")
    db.delete(acido)
    db.commit()
    return {"detail": "Datos eliminados exitosamente"}
