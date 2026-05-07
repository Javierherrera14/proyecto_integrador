from pydantic import BaseModel
from typing import Optional

class ListaIntercambiosBase(BaseModel):
    grupo_alimento_id: int
    alimento: str
    gramos: int
    unidad_medida: str
    kcal: int
    proteina_g: Optional[float]
    grasa_total_g: Optional[float]
    AGS_g: Optional[float]
    AGMI_g: Optional[float]
    AGPI_g: Optional[float]
    col_mg: Optional[float]
    CHO_g: Optional[float]
    fibra_dietetica_g: Optional[float]
    calcio_mg: Optional[float]
    fosforo_mg: Optional[float]
    hierro_mg: Optional[float]
    sodio_mg: Optional[float]
    potasio_mg: Optional[float]
    magnesio_mg: Optional[float]
    zinc_mg: Optional[float]
    cobre_mg: Optional[float]
    manganeso_mg: Optional[float]
    vitA_ER_ug: Optional[float]
    tiamina_mg: Optional[float]
    riboflavina_mg: Optional[float]
    niacina_mg: Optional[float]
    acido_pantotenico_mg: Optional[float]
    vitB6_mg: Optional[float]
    folato_EFD_ug: Optional[float]
    vitB12_mcg: Optional[float]
    vitC_mg: Optional[float]

class ListaIntercambiosCreate(ListaIntercambiosBase):
    pass

class ListaIntercambiosUpdate(ListaIntercambiosBase):
    pass

class ListaIntercambios(ListaIntercambiosBase):
    id: int

    class Config:
        orm_mode = True
