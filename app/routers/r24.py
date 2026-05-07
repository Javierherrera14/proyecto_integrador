# routes/r24.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import R24
from pydantic import BaseModel
from typing import Optional
from datetime import date

router = APIRouter(prefix="/r24", tags=["r24"])

class R24Create(BaseModel):
    id_paciente: int
    fecha: date
    observaciones: Optional[str] = None

class R24Update(BaseModel):
    fecha: Optional[date] = None
    observaciones: Optional[str] = None

@router.post("/")
def crear_r24(data: R24Create, db: Session = Depends(get_db)):
    nuevo_r24 = R24(**data.dict())
    db.add(nuevo_r24)
    db.commit()
    db.refresh(nuevo_r24)
    return nuevo_r24

@router.get("/")
def obtener_r24s(db: Session = Depends(get_db)):
    return db.query(R24).all()

@router.get("/{r24_id}")
def obtener_r24(r24_id: int, db: Session = Depends(get_db)):
    r24 = db.query(R24).filter(R24.id == r24_id).first()
    if not r24:
        raise HTTPException(status_code=404, detail="R24 no encontrado")
    return r24

@router.put("/{r24_id}")
def actualizar_r24(r24_id: int, data: R24Update, db: Session = Depends(get_db)):
    r24 = db.query(R24).filter(R24.id == r24_id).first()
    if not r24:
        raise HTTPException(status_code=404, detail="R24 no encontrado")
    for campo, valor in data.dict(exclude_unset=True).items():
        setattr(r24, campo, valor)
    db.commit()
    return r24

@router.delete("/{r24_id}")
def eliminar_r24(r24_id: int, db: Session = Depends(get_db)):
    r24 = db.query(R24).filter(R24.id == r24_id).first()
    if not r24:
        raise HTTPException(status_code=404, detail="R24 no encontrado")
    db.delete(r24)
    db.commit()
    return {"mensaje": "R24 eliminado correctamente"}
