from pydantic import BaseModel, ConfigDict
from typing import Optional

class CircunstanciasAmbientalesBase(BaseModel):
    acalasia: bool = False
    alcoholismo: bool = False
    esclerosis_lateral_amiotrofica: bool = False
    demencia: bool = False
    abuso_drogas: bool = False
    trastornos_alimentacion: bool = False
    sindrome_guillain_barre: bool = False
    desordenes_mentales: bool = False
    distrofias_musculares: bool = False
    dolor: bool = False
    anemia_falciforme: bool = False
    limitaciones_economicas: bool = False

class CircunstanciasAmbientalesCreate(CircunstanciasAmbientalesBase):
    id_paciente: int

class CircunstanciasAmbientalesUpdate(BaseModel):
    acalasia: Optional[bool] = None
    alcoholismo: Optional[bool] = None
    esclerosis_lateral_amiotrofica: Optional[bool] = None
    demencia: Optional[bool] = None
    abuso_drogas: Optional[bool] = None
    trastornos_alimentacion: Optional[bool] = None
    sindrome_guillain_barre: Optional[bool] = None
    desordenes_mentales: Optional[bool] = None
    distrofias_musculares: Optional[bool] = None
    dolor: Optional[bool] = None
    anemia_falciforme: Optional[bool] = None
    limitaciones_economicas: Optional[bool] = None

class CircunstanciasAmbientalesResponse(CircunstanciasAmbientalesBase):
    id: int
    id_paciente: int

    model_config = ConfigDict(from_attributes=True)
