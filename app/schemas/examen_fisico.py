from pydantic import BaseModel, ConfigDict
from typing import Optional

class ExamenFisicoBase(BaseModel):
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
    id_paciente: int

class ExamenFisicoUpdate(BaseModel):
    petequias: Optional[bool] = None
    dermatitis: Optional[bool] = None
    pelagra: Optional[bool] = None
    dermatitis_pintura_escamosa: Optional[bool] = None
    xerosis: Optional[bool] = None
    palidez: Optional[bool] = None
    no_curacion_heridas: Optional[bool] = None
    coiloniquia: Optional[bool] = None
    linea_transversal_beau: Optional[bool] = None
    plato_una_palido: Optional[bool] = None
    pobre_salud_plato_una: Optional[bool] = None
    unas_escamosas: Optional[bool] = None
    alopecia: Optional[bool] = None
    aclaramiento_pelo: Optional[bool] = None
    pelo_sacacorchos: Optional[bool] = None
    seborrea_nasolabial: Optional[bool] = None
    manchas_bitot: Optional[bool] = None
    keratomalacia: Optional[bool] = None
    conjuntiva_palida: Optional[bool] = None
    queilosis: Optional[bool] = None
    estomatitis_angular: Optional[bool] = None
    encias_esponjosas_sangrantes: Optional[bool] = None
    lesiones_boca: Optional[bool] = None
    encias_palidas: Optional[bool] = None
    glositis: Optional[bool] = None
    tiroides_agrandada: Optional[bool] = None

class ExamenFisicoResponse(ExamenFisicoBase):
    id: int
    id_paciente: int

    model_config = ConfigDict(from_attributes=True)
