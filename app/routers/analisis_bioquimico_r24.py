from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.models import (
    AnalisisBioquimicoR24, R24Detalle, Composicion_Alimentos,
    AnalisisProximal, Minerales, Vitaminas, AcidosGrasosColesterol
)
from pydantic import BaseModel

router = APIRouter(prefix="/analisis_bioquimico_r24", tags=["analisis_bioquimico_r24"])

class ResultadoAnalisisBioquimico(BaseModel):
    id: int
    r24_detalle_id: int
    proteina: float
    grasa_total: float
    grasa_saturada: float
    grasa_monoinsaturada: float
    grasa_poliinsaturada: float
    colesterol_mg: float
    carbohidratos: float
    fibra_dietetica: float
    sodio_mg: float
    calcio_mg: float
    potasio_mg: float
    fosforo_mg: float
    hierro_mg: float
    niacina_mg: float
    vitamina_a_ui: float
    vitamina_c_mg: float

    class Config:
        orm_mode = True

@router.post("/{r24_detalle_id}", response_model=ResultadoAnalisisBioquimico)
def generar_analisis_bioquimico(r24_detalle_id: int, db: Session = Depends(get_db)):
    detalle = db.query(R24Detalle).options(
        joinedload(R24Detalle.composicion_alimento).joinedload(ComposicionAlimentos.analisis_proximal),
        joinedload(R24Detalle.composicion_alimento).joinedload(ComposicionAlimentos.minerales),
        joinedload(R24Detalle.composicion_alimento).joinedload(ComposicionAlimentos.vitaminas),
        joinedload(R24Detalle.composicion_alimento).joinedload(ComposicionAlimentos.acidos_grasos_colesterol)
    ).filter(R24Detalle.id == r24_detalle_id).first()

    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle R24 no encontrado")

    gramos = detalle.gramos_consumidos
    alimento = detalle.composicion_alimento

    def escalar(valor):
        return (valor or 0.0) * gramos / 100

    analisis = AnalisisBioquimicoR24(
        r24_detalle_id=r24_detalle_id,

        # Macronutrientes
        proteina=escalar(alimento.analisis_proximal.proteina),
        grasa_total=escalar(alimento.analisis_proximal.grasa),
        grasa_saturada=escalar(alimento.acidos_grasos_colesterol.grasa_saturada),
        grasa_monoinsaturada=escalar(alimento.acidos_grasos_colesterol.grasa_monoinsaturada),
        grasa_poliinsaturada=escalar(alimento.acidos_grasos_colesterol.grasa_poliinsaturada),
        colesterol_mg=escalar(alimento.acidos_grasos_colesterol.colesterol_mg),
        carbohidratos=escalar(alimento.analisis_proximal.carbohidratos),
        fibra_dietetica=escalar(alimento.analisis_proximal.fibra_dietetica),

        # Micronutrientes
        sodio_mg=escalar(alimento.minerales.sodio_mg),
        calcio_mg=escalar(alimento.minerales.calcio_mg),
        potasio_mg=escalar(alimento.minerales.potasio_mg),
        fosforo_mg=escalar(alimento.minerales.fosforo_mg),
        hierro_mg=escalar(alimento.minerales.hierro_mg),
        niacina_mg=escalar(alimento.vitaminas.niacina_mg),
        vitamina_a_ui=escalar(alimento.vitaminas.vitamina_a_ui),
        vitamina_c_mg=escalar(alimento.vitaminas.vitamina_c_mg)
    )

    db.add(analisis)
    db.commit()
    db.refresh(analisis)
    return analisis

@router.get("/{id}", response_model=ResultadoAnalisisBioquimico)
def obtener_analisis(id: int, db: Session = Depends(get_db)):
    analisis = db.query(AnalisisBioquimicoR24).filter(AnalisisBioquimicoR24.id == id).first()
    if not analisis:
        raise HTTPException(status_code=404, detail="Análisis no encontrado")
    return analisis

@router.delete("/{id}")
def eliminar_analisis(id: int, db: Session = Depends(get_db)):
    analisis = db.query(AnalisisBioquimicoR24).filter(AnalisisBioquimicoR24.id == id).first()
    if not analisis:
        raise HTTPException(status_code=404, detail="Análisis no encontrado")
    db.delete(analisis)
    db.commit()
    return {"mensaje": "Análisis eliminado exitosamente"}
