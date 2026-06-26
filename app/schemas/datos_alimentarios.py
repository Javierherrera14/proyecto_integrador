from pydantic import BaseModel, ConfigDict
from typing import Optional

class DatosAlimentariosBase(BaseModel):
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

class DatosAlimentariosCreate(DatosAlimentariosBase):
    paciente_id: int

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

class DatosAlimentariosResponse(DatosAlimentariosBase):
    id: int
    paciente_id: int

    model_config = ConfigDict(from_attributes=True)
