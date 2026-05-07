from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Herramienta_Must
from app.schemas.Herramienta_Must import HerramientaMustCreate, HerramientaMustUpdate, HerramientaMust
from typing import List, Optional

router = APIRouter(prefix="/herramienta_must", tags=["herramienta_must"])

@router.post("/", response_model=HerramientaMust, status_code=status.HTTP_201_CREATED)
def crear_herramienta_must(datos: HerramientaMustCreate, db: Session = Depends(get_db)):
    print("📥 Recibido en FastAPI:", datos.dict())
    datos_dict = datos.dict()
    if datos_dict.get("fecha_evaluacion") is None:
        datos_dict.pop("fecha_evaluacion")  # ❌ Elimina el None para que se use el valor por defecto

    db_must = Herramienta_Must(**datos_dict)
    db.add(db_must)
    db.commit()
    db.refresh(db_must)
    return db_must


@router.get("/", response_model=List[HerramientaMust])
def obtener_todos(db: Session = Depends(get_db)):
    return db.query(Herramienta_Must).all()

@router.get("/{must_id}", response_model=HerramientaMust)
def obtener_por_id(must_id: int, db: Session = Depends(get_db)):
    must = db.query(Herramienta_Must).filter(Herramienta_Must.id == must_id).first()
    if not must:
        raise HTTPException(status_code=404, detail="Herramienta MUST no encontrada")
    return must

@router.get("/paciente/{id_paciente}", response_model=Optional[HerramientaMust])
def obtener_must_por_paciente(id_paciente: int, db: Session = Depends(get_db)):
    must = db.query(Herramienta_Must).filter(Herramienta_Must.id_paciente == id_paciente).first()
    return must  # Puede devolver None si no existe

@router.put("/{must_id}", response_model=HerramientaMust)
def actualizar_must(must_id: int, nuevos_datos: HerramientaMustUpdate, db: Session = Depends(get_db)):
    must = db.query(Herramienta_Must).filter(Herramienta_Must.id == must_id).first()
    if not must:
        raise HTTPException(status_code=404, detail="Herramienta MUST no encontrada")
    
    for key, value in nuevos_datos.dict(exclude_unset=True).items():
        setattr(must, key, value)
    
    db.commit()
    db.refresh(must)
    return must

@router.delete("/{must_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_must(must_id: int, db: Session = Depends(get_db)):
    must = db.query(Herramienta_Must).filter(Herramienta_Must.id == must_id).first()
    if not must:
        raise HTTPException(status_code=404, detail="Herramienta MUST no encontrada")
    
    db.delete(must)
    db.commit()
    return
