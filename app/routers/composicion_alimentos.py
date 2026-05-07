from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import Composicion_Alimentos
from app.database import get_db
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/composicion_alimentos", tags=["Composición de Alimentos"])

class ComposicionAlimentoBase(BaseModel):
    Categoria_id: int
    codigo: str
    nombre: str
    parte_analizada: str
    parte_comestible: float

class ComposicionAlimentoCreate(ComposicionAlimentoBase):
    pass

class ComposicionAlimentoUpdate(ComposicionAlimentoBase):
    pass

class ComposicionAlimentoOut(ComposicionAlimentoBase):
    id: int

    class Config:
        orm_mode = True

@router.post("/", response_model=ComposicionAlimentoOut)
def create_alimento(data: ComposicionAlimentoCreate, db: Session = Depends(get_db)):
    alimento = Composicion_Alimentos(**data.dict())
    db.add(alimento)
    db.commit()
    db.refresh(alimento)
    return alimento

@router.get("/", response_model=List[ComposicionAlimentoOut])
def get_all_alimentos(db: Session = Depends(get_db)):
    return db.query(Composicion_Alimentos).all()

@router.get("/{alimento_id}", response_model=ComposicionAlimentoOut)
def get_alimento(alimento_id: int, db: Session = Depends(get_db)):
    alimento = db.query(Composicion_Alimentos).filter(Composicion_Alimentos.id == alimento_id).first()
    if not alimento:
        raise HTTPException(status_code=404, detail="Alimento no encontrado")
    return alimento

@router.put("/{alimento_id}", response_model=ComposicionAlimentoOut)
def update_alimento(alimento_id: int, data: ComposicionAlimentoUpdate, db: Session = Depends(get_db)):
    alimento = db.query(Composicion_Alimentos).filter(Composicion_Alimentos.id == alimento_id).first()
    if not alimento:
        raise HTTPException(status_code=404, detail="Alimento no encontrado")
    for key, value in data.dict().items():
        setattr(alimento, key, value)
    db.commit()
    db.refresh(alimento)
    return alimento

@router.delete("/{alimento_id}")
def delete_alimento(alimento_id: int, db: Session = Depends(get_db)):
    alimento = db.query(Composicion_Alimentos).filter(Composicion_Alimentos.id == alimento_id).first()
    if not alimento:
        raise HTTPException(status_code=404, detail="Alimento no encontrado")
    db.delete(alimento)
    db.commit()
    return {"detail": "Alimento eliminado exitosamente"}
