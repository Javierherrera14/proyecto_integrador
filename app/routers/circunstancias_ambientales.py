# routes/documentos_historial.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Circunstancias_Ambientales
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/circunstancias_ambientales", tags=["circunstancias_ambientales"])

class circunstanciasAmbientalesCreate(BaseModel):
    id_paciente: int
    acalasia :  bool = False
    alcoholismo : bool = False
    esclerosis_lateral_amiotrofica : bool = False
    demencia : bool = False
    abuso_drogas : bool =False
    trastornos_alimentacion: bool = False
    sindrome_guillain_barre :  bool = False
    desordenes_mentales: bool = False
    distrofias_musculares:  bool = False
    dolor : bool = False
    anemia_falciforme : bool = False
    limitaciones_economicas:   bool = False
    

class circunstanciasAmbientalesUpdate(BaseModel):
    acalasia :  bool = None
    alcoholismo : bool = None
    esclerosis_lateral_amiotrofica : bool = None
    demencia : bool = None
    abuso_drogas : bool = None
    trastornos_alimentacion: bool = None
    sindrome_guillain_barre :  bool = None
    desordenes_mentales: bool = None
    distrofias_musculares:  bool = None
    dolor : bool = None
    anemia_falciforme : bool = None
    limitaciones_economicas: bool = None
    

@router.post("/")
def crear_circustancia_ambiental(documento: circunstanciasAmbientalesCreate, db: Session = Depends(get_db)):
    db_documento = Circunstancias_Ambientales(
        id_paciente = documento.id_paciente,
        acalasia = documento.acalasia,
        alcoholismo = documento.alcoholismo,
        esclerosis_lateral_amiotrofica = documento.esclerosis_lateral_amiotrofica,
        demencia = documento.demencia,
        abuso_drogas = documento.abuso_drogas,
        trastornos_alimentacion = documento.trastornos_alimentacion,
        sindrome_guillain_barre = documento.sindrome_guillain_barre,
        desordenes_mentales = documento.desordenes_mentales,
        distrofias_musculares= documento.distrofias_musculares,
        dolor = documento.dolor,
        anemia_falciforme = documento.anemia_falciforme,
        limitaciones_economicas = documento.limitaciones_economicas
    
    )
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    return {"mensaje": "Circunstancias ambientales creadas exitosamente", "documento": db_documento}

@router.get("/")
def obtener_documentos(db: Session = Depends(get_db)):
    documentos = db.query(Circunstancias_Ambientales).all()
    return documentos

@router.get("/{id}")
def obtener_documento(id: int, db: Session = Depends(get_db)):
    documento = db.query(Circunstancias_Ambientales).filter(Circunstancias_Ambientales.id == id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Circunstancias ambientales no encontradas")
    return documento

@router.put("/{id}")
def actualizar_documento(id: int, datos: circunstanciasAmbientalesUpdate, db: Session = Depends(get_db)):
    documento = db.query(Circunstancias_Ambientales).filter(Circunstancias_Ambientales.id == id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Circunstancias ambientales no encontrada")

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(documento, key, value)

    db.commit()
    db.refresh(documento)
    return {"mensaje": "Circunstancias ambientales actualizadas exitosamente", "documento": documento}

@router.delete("/{id}")
def eliminar_documento(id: int, db: Session = Depends(get_db)):
    documento = db.query(Circunstancias_Ambientales).filter(Circunstancias_Ambientales.id == id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Circunstancias ambientales no encontradas")

    db.delete(documento)
    db.commit()
    return {"mensaje": "Circunstancias ambientales eliminadas exitosamente"}
