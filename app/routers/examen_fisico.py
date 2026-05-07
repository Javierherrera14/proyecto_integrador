from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.models import Examen_Fisico
from app.database import get_db

router = APIRouter(prefix="/examen_fisico", tags=["Examen Físico"])

# Esquemas Pydantic
class ExamenFisicoBase(BaseModel):
    id_paciente: int
    petequias: bool
    dermatitis: bool
    pelagra: bool
    dermatitis_pintura_escamosa: bool
    xerosis: bool
    palidez: bool
    no_curacion_heridas: bool
    coiloniquia: bool
    linea_transversal_beau: bool
    plato_una_palido: bool
    pobre_salud_plato_una: bool
    unas_escamosas: bool
    alopecia: bool
    aclaramiento_pelo: bool
    pelo_sacacorchos: bool
    seborrea_nasolabial: bool
    manchas_bitot: bool
    keratomalacia: bool
    conjuntiva_palida: bool
    queilosis: bool
    estomatitis_angular: bool
    encias_esponjosas_sangrantes: bool
    lesiones_boca: bool
    encias_palidas: bool
    glositis: bool
    tiroides_agrandada: bool

class ExamenFisicoCreate(ExamenFisicoBase):
    pass

class ExamenFisicoUpdate(BaseModel):
    id_paciente: Optional[int]
    petequias: Optional[bool]
    dermatitis: Optional[bool]
    pelagra: Optional[bool]
    dermatitis_pintura_escamosa: Optional[bool]
    xerosis: Optional[bool]
    palidez: Optional[bool]
    no_curacion_heridas: Optional[bool]
    coiloniquia: Optional[bool]
    linea_transversal_beau: Optional[bool]
    plato_una_palido: Optional[bool]
    pobre_salud_plato_una: Optional[bool]
    unas_escamosas: Optional[bool]
    alopecia: Optional[bool]
    aclaramiento_pelo: Optional[bool]
    pelo_sacacorchos: Optional[bool]
    seborrea_nasolabial: Optional[bool]
    manchas_bitot: Optional[bool]
    keratomalacia: Optional[bool]
    conjuntiva_palida: Optional[bool]
    queilosis: Optional[bool]
    estomatitis_angular: Optional[bool]
    encias_esponjosas_sangrantes: Optional[bool]
    lesiones_boca: Optional[bool]
    encias_palidas: Optional[bool]
    glositis: Optional[bool]
    tiroides_agrandada: Optional[bool]

class ExamenFisico(ExamenFisicoBase):
    id: int

    class Config:
        orm_mode = True

# Rutas CRUD
@router.get("/", response_model=List[ExamenFisico])
def get_all_examenes_fisicos(db: Session = Depends(get_db)):
    return db.query(Examen_Fisico).all()

@router.get("/{id}", response_model=ExamenFisico)
def get_examen_fisico(id: int, db: Session = Depends(get_db)):
    examen = db.query(Examen_Fisico).filter(Examen_Fisico.id == id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen físico no encontrado")
    return examen

@router.post("/", response_model=ExamenFisico)
def create_examen_fisico(examen: ExamenFisicoCreate, db: Session = Depends(get_db)):
    db_examen = Examen_Fisico(**examen.dict())
    db.add(db_examen)
    db.commit()
    db.refresh(db_examen)
    return db_examen

@router.put("/{id}", response_model=ExamenFisico)
def update_examen_fisico(id: int, updated_data: ExamenFisicoUpdate, db: Session = Depends(get_db)):
    examen = db.query(Examen_Fisico).filter(Examen_Fisico.id == id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen físico no encontrado")
    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(examen, key, value)
    db.commit()
    db.refresh(examen)
    return examen

@router.delete("/{id}")
def delete_examen_fisico(id: int, db: Session = Depends(get_db)):
    examen = db.query(Examen_Fisico).filter(Examen_Fisico.id == id).first()
    if not examen:
        raise HTTPException(status_code=404, detail="Examen físico no encontrado")
    db.delete(examen)
    db.commit()
    return {"message": "Examen físico eliminado correctamente"}
