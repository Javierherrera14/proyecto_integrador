from sqlalchemy.orm import Session
from models import (
    R24Detalle,
    AnalisisBioquimicoR24,
    Composicion_Alimentos,
    AnalisisProximal,
    Minerales,
    Vitaminas,
    AcidosGrasosColesterol,
)


def calcular_y_guardar_analisis_bioquimico(db: Session, r24_detalle_id: int):
    # Obtener el detalle del R24
    detalle = db.query(R24Detalle).filter(R24Detalle.id == r24_detalle_id).first()
    if not detalle:
        raise ValueError("Detalle R24 no encontrado.")

    gramos = detalle.gramos_consumidos
    alimento = detalle.alimento

    if not alimento:
        raise ValueError("No se encontró el alimento relacionado con el R24Detalle.")

    # Obtener datos nutricionales del alimento
    proximal = alimento.analisis_proximal
    minerales = alimento.minerales
    vitaminas = alimento.vitaminas
    acidos = alimento.acidos_grasos_colesterol

    def calc(valor):
        return (valor * gramos) / 100 if valor is not None else None

    # Crear el análisis bioquímico
    analisis = AnalisisBioquimicoR24(
        r24_detalle_id=detalle.id,

        # Macronutrientes
        proteina=calc(proximal.proteina) if proximal else None,
        grasa_total=calc(proximal.grasa) if proximal else None,
        carbohidratos=calc(proximal.carbohidratos) if proximal else None,
        fibra_dietetica=calc(proximal.fibra) if proximal else None,

        # Grasas y colesterol
        grasa_saturada=calc(acidos.grasa_saturada) if acidos else None,
        grasa_monoinsaturada=calc(acidos.grasa_monoinsaturada) if acidos else None,
        grasa_poliinsaturada=calc(acidos.grasa_poliinsaturada) if acidos else None,
        colesterol_mg=calc(acidos.colesterol) if acidos else None,

        # Minerales
        sodio_mg=calc(minerales.sodio) if minerales else None,
        calcio_mg=calc(minerales.calcio) if minerales else None,
        potasio_mg=calc(minerales.potasio) if minerales else None,
        fosforo_mg=calc(minerales.fosforo) if minerales else None,
        hierro_mg=calc(minerales.hierro) if minerales else None,

        # Vitaminas
        niacina_mg=calc(vitaminas.niacina) if vitaminas else None,
        vitamina_a_ui=calc(vitaminas.vitamina_a_ui) if vitaminas else None,
        vitamina_c_mg=calc(vitaminas.vitamina_c) if vitaminas else None,
    )

    # Guardar en la base de datos
    db.add(analisis)
    db.commit()
    db.refresh(analisis)
    return analisis
