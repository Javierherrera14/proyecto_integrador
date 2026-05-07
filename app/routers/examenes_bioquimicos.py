from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Examenes_Bioquimicos
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

router = APIRouter(prefix="/examenes_bioquimicos", tags=["examenes_bioquimicos"])

class ExamenBioquimicoCreate(BaseModel):
    id_paciente: int
    hemoglobina_glicada: Decimal
    glicemia_basal: int
    colesterol_total: int
    colesterol_hdl: int
    colesterol_ldl: int
    trigliceridos: int
    creatinina: Decimal
    interpretacion_hemoglobina: str
    interpretacion_glicemia: str
    interpretacion_colesterol_total: str
    interpretacion_colesterol_hdl: str
    interpretacion_colesterol_ldl: str
    interpretacion_trigliceridos: str
    interpretacion_creatinina: str

class ExamenBioquimicoUpdate(BaseModel):
    hemoglobina_glicada: Optional[Decimal] = None
    glicemia_basal: Optional[int] = None
    colesterol_total: Optional[int] = None
    colesterol_hdl: Optional[int] = None
    colesterol_ldl: Optional[int] = None
    trigliceridos: Optional[int] = None
    creatinina: Optional[Decimal] = None
    interpretacion_hemoglobina: Optional[str] = None
    interpretacion_glicemia: Optional[str] = None
    interpretacion_colesterol_total: Optional[str] = None
    interpretacion_colesterol_hdl: Optional[str] = None
    interpretacion_colesterol_ldl: Optional[str] = None
    interpretacion_trigliceridos: Optional[str] = None
    interpretacion_creatinina: Optional[str] = None

class ExamenBioquimicoResponse(ExamenBioquimicoCreate):
    id: int

    class Config:
        orm_mode = True

@router.post("/")
def crear_examen_bioquimico(datos: ExamenBioquimicoCreate, db: Session = Depends(get_db)):
    nuevo_examen = Examenes_Bioquimicos(**datos.dict())
    db.add(nuevo_examen)
    db.commit()
    db.refresh(nuevo_examen)
    return {"mensaje": "Examen bioquímico creado exitosamente", "datos": nuevo_examen}

@router.get("/")
def obtener_todos_examenes_bioquimicos(db: Session = Depends(get_db)):
    return db.query(Examenes_Bioquimicos).all()

@router.get("/{examen_id}")
def obtener_examen_bioquimico_por_id(examen_id: int, db: Session = Depends(get_db)):
    examen = db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen bioquímico no encontrado")
    return examen

@router.get("/paciente/{paciente_id}")
def obtener_examenes_por_paciente(paciente_id: int, db: Session = Depends(get_db)):
    return db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id_paciente == paciente_id).all()

@router.put("/{examen_id}")
def actualizar_examen_bioquimico(examen_id: int, datos: ExamenBioquimicoUpdate, db: Session = Depends(get_db)):
    examen = db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen bioquímico no encontrado")

    for campo, valor in datos.dict(exclude_unset=True).items():
        setattr(examen, campo, valor)

    db.commit()
    db.refresh(examen)
    return {"mensaje": "Examen bioquímico actualizado exitosamente", "datos": examen}

@router.delete("/{examen_id}")
def eliminar_examen_bioquimico(examen_id: int, db: Session = Depends(get_db)):
    examen = db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id == examen_id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen bioquímico no encontrado")

    db.delete(examen)
    db.commit()
    return {"mensaje": "Examen bioquímico eliminado exitosamente"}
