from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import Vitaminas
from app.database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/vitaminas", tags=["Vitaminas"])

class VitaminasBase(BaseModel):
    tiamina: Optional[float]
    riboflavina: Optional[float]
    niacina: Optional[float]
    folatos: Optional[float]
    vitamina_b12: Optional[float]
    vitamina_c: Optional[float]
    vitamina_a: Optional[float]

class VitaminasCreate(VitaminasBase):
    alimento_id: int

class VitaminasOut(VitaminasCreate):
    class Config:
        orm_mode = True

@router.post("/", response_model=VitaminasOut)
def create_vitaminas(data: VitaminasCreate, db: Session = Depends(get_db)):
    vitaminas = Vitaminas(**data.dict())
    db.add(vitaminas)
    db.commit()
    db.refresh(vitaminas)
    return vitaminas

@router.get("/{alimento_id}", response_model=VitaminasOut)
def get_vitaminas(alimento_id: int, db: Session = Depends(get_db)):
    vitaminas = db.query(Vitaminas).filter(Vitaminas.alimento_id == alimento_id).first()
    if not vitaminas:
        raise HTTPException(status_code=404, detail="Vitaminas no encontradas")
    return vitaminas

@router.put("/{alimento_id}", response_model=VitaminasOut)
def update_vitaminas(alimento_id: int, data: VitaminasBase, db: Session = Depends(get_db)):
    vitaminas = db.query(Vitaminas).filter(Vitaminas.alimento_id == alimento_id).first()
    if not vitaminas:
        raise HTTPException(status_code=404, detail="Vitaminas no encontradas")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(vitaminas, key, value)
    db.commit()
    db.refresh(vitaminas)
    return vitaminas

@router.delete("/{alimento_id}")
def delete_vitaminas(alimento_id: int, db: Session = Depends(get_db)):
    vitaminas = db.query(Vitaminas).filter(Vitaminas.alimento_id == alimento_id).first()
    if not vitaminas:
        raise HTTPException(status_code=404, detail="Vitaminas no encontradas")
    db.delete(vitaminas)
    db.commit()
    return {"detail": "Vitaminas eliminadas exitosamente"}
