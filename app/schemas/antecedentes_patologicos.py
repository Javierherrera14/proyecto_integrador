from pydantic import BaseModel, ConfigDict
from typing import Optional

class AntecedentesPatologicosBase(BaseModel):
    hipertension_personal: bool = False
    hipercolesterolemia_personal: bool = False
    diabetes_personal: bool = False
    hipertrigliceridemia_personal: bool = False
    obesidad_personal: bool = False
    enfermedad_cardiovascular_personal: bool = False
    enfermedad_renal_personal: bool = False
    enfermedad_gastrointestinal_personal: bool = False
    hipertension_familiar: bool = False
    hipercolesterolemia_familiar: bool = False
    diabetes_familiar: bool = False 
    hipertrigliceridemia_familiar: bool = False
    obesidad_familiar: bool = False  
    enfermedad_cardiovascular_familiar: bool = False 
    enfermedad_renal_familiar: bool = False
    enfermedad_gastrointestinal_familiar: bool = False 
    quirurgicos: str

class AntecedentesPatologicosCreate(AntecedentesPatologicosBase):
    id_paciente: int

class AntecedentesPatologicosUpdate(BaseModel):
    hipertension_personal: Optional[bool] = None
    hipercolesterolemia_personal: Optional[bool] = None
    diabetes_personal: Optional[bool] = None
    hipertrigliceridemia_personal: Optional[bool] = None
    obesidad_personal: Optional[bool] = None
    enfermedad_cardiovascular_personal: Optional[bool] = None
    enfermedad_renal_personal: Optional[bool] = None
    enfermedad_gastrointestinal_personal: Optional[bool] = None
    hipertension_familiar: Optional[bool] = None
    hipercolesterolemia_familiar: Optional[bool] = None
    diabetes_familiar: Optional[bool] = None 
    hipertrigliceridemia_familiar: Optional[bool] = None
    obesidad_familiar: Optional[bool] = None  
    enfermedad_cardiovascular_familiar: Optional[bool] = None 
    enfermedad_renal_familiar: Optional[bool] = None
    enfermedad_gastrointestinal_familiar: Optional[bool] = None 
    quirurgicos: Optional[str] = None

class AntecedentesPatologicosResponse(AntecedentesPatologicosBase):
    id: int
    id_paciente: int

    model_config = ConfigDict(from_attributes=True)
