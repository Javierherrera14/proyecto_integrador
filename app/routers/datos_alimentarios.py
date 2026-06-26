from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Datos_Alimentarios
from typing import List, Optional
from app.schemas.datos_alimentarios import (
    DatosAlimentariosCreate,
    DatosAlimentariosUpdate,
    DatosAlimentariosResponse
)

router = APIRouter(prefix="/datos_alimentarios", tags=["datos_alimentarios"])

@router.post("/", response_model=DatosAlimentariosResponse)
def crear_datos_alimentarios(datos: DatosAlimentariosCreate, db: Session = Depends(get_db)):
    existente = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.paciente_id == datos.paciente_id).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existen datos alimentarios para este paciente")
    
    db_datos = Datos_Alimentarios(**datos.model_dump())
    db.add(db_datos)
    db.commit()
    db.refresh(db_datos)
    return db_datos

@router.get("/", response_model=List[DatosAlimentariosResponse])
def obtener_datos_alimentarios(db: Session = Depends(get_db)):
    return db.query(Datos_Alimentarios).all()

@router.get("/{datos_id}", response_model=DatosAlimentariosResponse)
def obtener_datos_por_id(datos_id: int, db: Session = Depends(get_db)):
    datos = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.id == datos_id).first()
    if not datos:
        raise HTTPException(status_code=404, detail="Datos alimentarios no encontrados")
    return datos

@router.get("/paciente/{id_paciente}", response_model=Optional[DatosAlimentariosResponse])
def obtener_por_paciente(id_paciente: int, db: Session = Depends(get_db)):
    datos = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.paciente_id == id_paciente).first()
    return datos

@router.get("/existe/{id_paciente}")
def verificar_existencia(id_paciente: int, db: Session = Depends(get_db)):
    existe = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.paciente_id == id_paciente).first() is not None
    return {"existe": existe}

@router.put("/{datos_id}", response_model=DatosAlimentariosResponse)
def actualizar_datos_alimentarios(datos_id: int, nuevos_datos: DatosAlimentariosUpdate, db: Session = Depends(get_db)):
    datos = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.id == datos_id).first()
    if not datos:
        raise HTTPException(status_code=404, detail="Datos alimentarios no encontrados")
    
    for key, value in nuevos_datos.model_dump(exclude_unset=True).items():
        setattr(datos, key, value)
    
    db.commit()
    db.refresh(datos)
    return datos

@router.delete("/{datos_id}")
def eliminar_datos_alimentarios(datos_id: int, db: Session = Depends(get_db)):
    datos = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.id == datos_id).first()
    if not datos:
        raise HTTPException(status_code=404, detail="Datos alimentarios no encontrados")
    
    db.delete(datos)
    db.commit()
    return {"mensaje": "Datos alimentarios eliminados exitosamente"}
