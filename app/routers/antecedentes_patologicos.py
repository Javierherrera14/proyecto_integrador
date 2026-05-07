# routes/documentos_historial.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Antecedentes_Patologicos
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/antecedentes_patologicos", tags=["antecedentes_patologicos"])

class antecedentesPatologicosCreate(BaseModel):
    id_paciente: int
    hipertension_personal: bool = False
    hipercolesterolemia_personal : bool = False
    diabetes_personal: bool = False
    hipertrigliceridemia_personal: bool = False
    obesidad_personal: bool = False
    enfermedad_cardiovascular_personal: bool = False
    enfermedad_renal_personal: bool = False
    enfermedad_gastrointestinal_personal: bool = False
    hipertension_familiar: bool = False
    hipercolesterolemia_familiar: bool = False
    diabetes_familiar: bool = False 
    hipertrigliceridemia_familiar : bool = False
    obesidad_familiar: bool = False  
    enfermedad_cardiovascular_familiar: bool = False 
    enfermedad_renal_familiar:bool = False
    enfermedad_gastrointestinal_familiar: bool = False 
    quirurgicos: str 
    

class antecedentesPatologicosUpdate(BaseModel):
    hipertension_personal: bool = None
    hipercolesterolemia_personal : bool = None
    diabetes_personal: bool = None
    hipertrigliceridemia_personal: bool = None
    obesidad_personal: bool =  None
    enfermedad_cardiovascular_personal: bool = None
    enfermedad_renal_personal: bool = None
    enfermedad_gastrointestinal_personal: bool = None
    hipertension_familiar: bool = None
    hipercolesterolemia_familiar: bool = None
    diabetes_familiar: bool = None
    hipertrigliceridemia_familiar : bool = None
    obesidad_familiar: bool = None
    enfermedad_cardiovascular_familiar: bool = None 
    enfermedad_renal_familiar:bool = None
    enfermedad_gastrointestinal_familiar: bool = None 
    quirurgicos: str = None
    

@router.post("/")
def crear_antecedente(documento: antecedentesPatologicosCreate, db: Session = Depends(get_db)):
    db_documento = Antecedentes_Patologicos(
        id_paciente = documento.id_paciente,
        hipertension_personal = documento.hipertension_personal,
        hipercolesterolemia_personal = documento.hipercolesterolemia_personal,
        diabetes_personal = documento.diabetes_personal,
        hipertrigliceridemia_personal = documento.hipertrigliceridemia_personal,
        obesidad_personal = documento.obesidad_personal,
        enfermedad_cardiovascular_personal =  documento.enfermedad_cardiovascular_personal,
        enfermedad_renal_personal = documento.enfermedad_renal_personal, 
        enfermedad_gastrointestinal_personal = documento.enfermedad_gastrointestinal_personal,
        hipertension_familiar = documento.hipertension_familiar,
        hipercolesterolemia_familiar = documento.hipercolesterolemia_familiar,
        diabetes_familiar = documento.diabetes_familiar,
        hipertrigliceridemia_familiar= documento.hipertrigliceridemia_familiar,
        obesidad_familiar =  documento.obesidad_familiar,
        enfermedad_cardiovascular_familiar =  documento.enfermedad_cardiovascular_familiar,
        enfermedad_renal_familiar =documento.enfermedad_renal_familiar,
        enfermedad_gastrointestinal_familiar = documento.enfermedad_gastrointestinal_familiar,
        quirurgicos =documento.quirurgicos 
    
    )
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    return {"mensaje": "Antecedente patologico creado exitosamente", "documento": db_documento}

@router.get("/")
def obtener_documentos(db: Session = Depends(get_db)):
    documentos = db.query(Antecedentes_Patologicos).all()
    return documentos

@router.get("/{antecedente_id}")
def obtener_documento(antecedente_id: int, db: Session = Depends(get_db)):
    documento = db.query(Antecedentes_Patologicos).filter(Antecedentes_Patologicos.id == antecedente_id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Antecedente no encontrado")
    return documento



@router.put("/{antecedente_id}")
def actualizar_documento(antecedente_id: int, datos: antecedentesPatologicosUpdate, db: Session = Depends(get_db)):
    documento = db.query(Antecedentes_Patologicos).filter(Antecedentes_Patologicos.id == antecedente_id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Antecedente no encontrado")

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(documento, key, value)

    db.commit()
    db.refresh(documento)
    return {"mensaje": "Antecedente patologico actualizado exitosamente", "documento": documento}

@router.delete("/{antecedente_id}")
def eliminar_documento(antecedente_id: int, db: Session = Depends(get_db)):
    documento = db.query(Antecedentes_Patologicos).filter(Antecedentes_Patologicos.id == antecedente_id).first()
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")

    db.delete(documento)
    db.commit()
    return {"mensaje": "Antecedente patologico eliminado exitosamente"}
