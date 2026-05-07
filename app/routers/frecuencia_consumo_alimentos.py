from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Frecuencia_Consumo_Alimentos
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/frecuencia_consumo_alimentos", tags=["frecuencia_consumo_alimentos"])

class FrecuenciaConsumoCreate(BaseModel):
    id_paciente: int
    grupo_alimentos: str
    alimento: str
    consume_si: bool
    consume_no: bool
    consume_dia: bool
    frecuencia_dia: bool
    frecuencia_semana: bool
    frecuencia_mes: bool
    clasificacion_poco_frecuente: bool
    clasificacion_frecuente: bool
    clasificacion_muy_frecuente: bool

class FrecuenciaConsumoUpdate(BaseModel):
    grupo_alimentos: Optional[str] = None
    alimento: Optional[str] = None
    consume_si: Optional[bool] = None
    consume_no: Optional[bool] = None
    consume_dia: Optional[bool] = None
    frecuencia_dia: Optional[bool] = None
    frecuencia_semana: Optional[bool] = None
    frecuencia_mes: Optional[bool] = None
    clasificacion_poco_frecuente: Optional[bool] = None
    clasificacion_frecuente: Optional[bool] = None
    clasificacion_muy_frecuente: Optional[bool] = None

@router.post("/")
def crear_frecuencia_consumo(datos: FrecuenciaConsumoCreate, db: Session = Depends(get_db)):
    db_item = Frecuencia_Consumo_Alimentos(**datos.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return {"mensaje": "Registro de frecuencia de consumo creado exitosamente", "datos": db_item}

@router.get("/")
def obtener_todos(db: Session = Depends(get_db)):
    return db.query(Frecuencia_Consumo_Alimentos).all()

@router.get("/{item_id}")
def obtener_por_id(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Frecuencia_Consumo_Alimentos).filter(Frecuencia_Consumo_Alimentos.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return item

@router.put("/{item_id}")
def actualizar(item_id: int, nuevos_datos: FrecuenciaConsumoUpdate, db: Session = Depends(get_db)):
    item = db.query(Frecuencia_Consumo_Alimentos).filter(Frecuencia_Consumo_Alimentos.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Registro no encontrado")

    for key, value in nuevos_datos.dict(exclude_unset=True).items():
        setattr(item, key, value)
    
    db.commit()
    db.refresh(item)
    return {"mensaje": "Registro actualizado exitosamente", "datos": item}

@router.delete("/{item_id}")
def eliminar(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Frecuencia_Consumo_Alimentos).filter(Frecuencia_Consumo_Alimentos.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    
    db.delete(item)
    db.commit()
    return {"mensaje": "Registro eliminado exitosamente"}
