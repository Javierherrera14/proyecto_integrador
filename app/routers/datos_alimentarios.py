from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Datos_Alimentarios
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/datos_alimentarios", tags=["datos_alimentarios"])

# Schemas
class DatosAlimentariosCreate(BaseModel):
    paciente_id: int
    intolerancia_alimentos: bool
    alimentos_intolerancia: str
    consumo_variable_emocional: bool
    come_tiempo_comida: bool
    frecuencia_comida: str
    problemas_digestivos: bool
    tipo_problema_digestivo: str
    consume_medicamentos: bool
    lista_medicamentos: str
    toma_suplementos: bool
    agrega_sal: bool
    alimentos_no_agradan: str
    alimentos_agradan: str

class DatosAlimentariosUpdate(BaseModel):
    intolerancia_alimentos: Optional[bool] = None
    alimentos_intolerancia: Optional[str] = None
    consumo_variable_emocional: Optional[bool] = None
    come_tiempo_comida: Optional[bool] = None
    frecuencia_comida: Optional[str] = None
    problemas_digestivos: Optional[bool] = None
    tipo_problema_digestivo: Optional[str] = None
    consume_medicamentos: Optional[bool] = None
    lista_medicamentos: Optional[str] = None
    toma_suplementos: Optional[bool] = None
    agrega_sal: Optional[bool] = None
    alimentos_no_agradan: Optional[str] = None
    alimentos_agradan: Optional[str] = None

# Endpoints

@router.post("/")
def crear_datos_alimentarios(datos: DatosAlimentariosCreate, db: Session = Depends(get_db)):
    existente = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.paciente_id == datos.paciente_id).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existen datos alimentarios para este paciente")
    
    db_datos = Datos_Alimentarios(**datos.dict())
    db.add(db_datos)
    db.commit()
    db.refresh(db_datos)
    return {"mensaje": "Datos alimentarios creados exitosamente", "datos": db_datos}

@router.get("/")
def obtener_datos_alimentarios(db: Session = Depends(get_db)):
    return db.query(Datos_Alimentarios).all()

@router.get("/{datos_id}")
def obtener_datos_por_id(datos_id: int, db: Session = Depends(get_db)):
    datos = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.id == datos_id).first()
    if not datos:
        raise HTTPException(status_code=404, detail="Datos alimentarios no encontrados")
    return datos

@router.get("/paciente/{id_paciente}")
def obtener_por_paciente(id_paciente: int, db: Session = Depends(get_db)):
    datos = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.id_paciente == id_paciente).first()
    return datos  # Retorna None si no hay datos (no lanza error)

@router.get("/existe/{id_paciente}")
def verificar_existencia(id_paciente: int, db: Session = Depends(get_db)):
    existe = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.id_paciente == id_paciente).first() is not None
    return {"existe": existe}

@router.put("/{datos_id}")
def actualizar_datos_alimentarios(datos_id: int, nuevos_datos: DatosAlimentariosUpdate, db: Session = Depends(get_db)):
    datos = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.id == datos_id).first()
    if not datos:
        raise HTTPException(status_code=404, detail="Datos alimentarios no encontrados")
    
    for key, value in nuevos_datos.dict(exclude_unset=True).items():
        setattr(datos, key, value)
    
    db.commit()
    db.refresh(datos)
    return {"mensaje": "Datos alimentarios actualizados exitosamente", "datos": datos}

@router.delete("/{datos_id}")
def eliminar_datos_alimentarios(datos_id: int, db: Session = Depends(get_db)):
    datos = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.id == datos_id).first()
    if not datos:
        raise HTTPException(status_code=404, detail="Datos alimentarios no encontrados")
    
    db.delete(datos)
    db.commit()
    return {"mensaje": "Datos alimentarios eliminados exitosamente"}
