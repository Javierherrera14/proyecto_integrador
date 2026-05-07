from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,  Float, Time
from app.database import Base
from datetime import datetime


# app/models/models.py


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre_completo = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    contrasena = Column(Text, nullable=False)
    rol = Column(String, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    paciente = relationship("Paciente", back_populates="usuario")

class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre_completo = Column(String, nullable=False)
    edad = Column(Integer, nullable=False)
    sexo = Column(String, nullable=False)
    telefono = Column(String, nullable=False)
    direccion = Column(String, nullable = False)
    fecha_registro = Column(DateTime, default=datetime.utcnow)
    usuario_id = Column(Integer, ForeignKey("usuarios.id",ondelete="CASCADE"), nullable=False)
    peso_actual = Column(Float, nullable=False)    
    peso_usual = Column(Float, nullable=False) 
    talla = Column(Integer, nullable=False)      
    circunferencia_cintura = Column(Integer, nullable=False)
    ind_masa_corporal = Column(Float, nullable=False)
    activo = Column(Boolean, default=True)

    clasificacion_imc = Column(String, nullable=True)
    clasificacion_circunferencia = Column(String, nullable=True)

    usuario = relationship("Usuario", back_populates="paciente")
    herramienta_must = relationship("Herramienta_Must", back_populates="paciente", cascade="all, delete-orphan")
    frecuencia_consumo_alimentos = relationship("Frecuencia_Consumo_Alimentos", back_populates="paciente", cascade="all, delete-orphan")
    examenes_bioquimicos = relationship("Examenes_Bioquimicos", back_populates="paciente", cascade="all, delete-orphan")
    examen_fisico = relationship("Examen_Fisico", back_populates="paciente", cascade="all, delete-orphan")
    datos_alimentarios = relationship("Datos_Alimentarios", back_populates="paciente", cascade="all, delete-orphan")
    circunstancias_ambientales = relationship("Circunstancias_Ambientales", back_populates="paciente", cascade="all, delete-orphan")
    antecedentes_patologicos = relationship("Antecedentes_Patologicos", back_populates="paciente", cascade="all, delete-orphan")
    r24 = relationship("R24", back_populates="paciente", cascade="all, delete-orphan")
  


class Antecedentes_Patologicos(Base): 
    __tablename__ = "antecedentes_patologicos"
    
    id = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("pacientes.id", ondelete="CASCADE"), nullable=False)
    hipertension_personal = Column(Boolean, nullable=False) 
    hipercolesterolemia_personal = Column(Boolean, nullable=False)
    diabetes_personal = Column(Boolean, nullable=False)
    hipertrigliceridemia_personal = Column(Boolean, nullable=False) 
    obesidad_personal = Column(Boolean, nullable=False) 
    enfermedad_cardiovascular_personal = Column(Boolean, nullable=False)    
    enfermedad_renal_personal = Column(Boolean, nullable=False)
    enfermedad_gastrointestinal_personal = Column(Boolean, nullable=False)
    hipertension_familiar = Column(Boolean, nullable=False) 
    hipercolesterolemia_familiar = Column(Boolean, nullable=False) 
    diabetes_familiar = Column(Boolean, nullable=False) 
    hipertrigliceridemia_familiar =  Column(Boolean, nullable=False)  
    obesidad_familiar = Column(Boolean, nullable=False)  
    enfermedad_cardiovascular_familiar = Column(Boolean, nullable=False) 
    enfermedad_renal_familiar = Column(Boolean, nullable=False)  
    enfermedad_gastrointestinal_familiar = Column(Boolean, nullable=False)
    quirurgicos = Column(String, nullable=False)
    
    paciente = relationship("Paciente", back_populates="antecedentes_patologicos")


class Circunstancias_Ambientales(Base): 
    __tablename__ = "circunstancias_ambientales"
    
    id = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("pacientes.id",ondelete="CASCADE"), nullable=False)
    acalasia = Column(Boolean, nullable=False) 
    alcoholismo = Column(Boolean, nullable=False)
    esclerosis_lateral_amiotrofica = Column(Boolean, nullable=False)
    demencia = Column(Boolean, nullable=False)
    abuso_drogas = Column(Boolean, nullable=False)  
    trastornos_alimentacion = Column(Boolean, nullable=False)   
    sindrome_guillain_barre = Column(Boolean, nullable=False)   
    desordenes_mentales = Column(Boolean, nullable=False)
    distrofias_musculares =  Column(Boolean, nullable=False)
    dolor =  Column(Boolean, nullable=False)
    anemia_falciforme = Column(Boolean, nullable=False) 
    limitaciones_economicas = Column(Boolean, nullable=False)   
    
    paciente = relationship("Paciente", back_populates="circunstancias_ambientales")


class Datos_Alimentarios(Base):
    __tablename__ = "datos_alimentarios"
    
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id",ondelete="CASCADE"), nullable=False)
    intolerancia_alimentos = Column(Boolean, nullable=False)
    alimentos_intolerancia = Column(String, nullable=False)
    consumo_variable_emocional = Column(Boolean, nullable=False)    
    come_tiempo_comida = Column(Boolean, nullable=False)    
    frecuencia_comida = Column(String, nullable=False)
    problemas_digestivos = Column(Boolean, nullable=False)
    tipo_problema_digestivo = Column(String, nullable=False)
    consume_medicamentos = Column(Boolean, nullable=False)
    lista_medicamentos = Column(String, nullable=False)
    toma_suplementos = Column(Boolean, nullable=False)
    agrega_sal = Column(Boolean, nullable = False)
    alimentos_no_agradan = Column(String, nullable=False)
    alimentos_agradan = Column(String,  nullable = False)
    
    paciente = relationship("Paciente", back_populates="datos_alimentarios")


class Examen_Fisico(Base):
    __tablename__ = "examen_fisico"
    
    id = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("pacientes.id",ondelete="CASCADE"), nullable=False)
    petequias = Column(Boolean, nullable=False)
    dermatitis = Column(Boolean, nullable=False)    
    pelagra = Column(Boolean, nullable=False)
    dermatitis_pintura_escamosa = Column(Boolean, nullable=False)
    xerosis = Column(Boolean, nullable=False)   
    palidez = Column(Boolean, nullable=False)
    no_curacion_heridas = Column(Boolean, nullable=False)   
    coiloniquia = Column(Boolean, nullable=False)   
    linea_transversal_beau = Column(Boolean, nullable=False)
    plato_una_palido = Column(Boolean, nullable=False)
    pobre_salud_plato_una = Column(Boolean, nullable=False) 
    unas_escamosas = Column(Boolean, nullable=False)    
    alopecia = Column(Boolean, nullable=False)
    aclaramiento_pelo = Column(Boolean, nullable=False) 
    pelo_sacacorchos = Column(Boolean, nullable=False)  
    seborrea_nasolabial = Column(Boolean, nullable=False)   
    manchas_bitot = Column(Boolean, nullable=False) 
    keratomalacia = Column(Boolean, nullable=False)
    conjuntiva_palida = Column(Boolean, nullable=False) 
    queilosis = Column(Boolean, nullable=False) 
    estomatitis_angular = Column(Boolean, nullable=False)   
    encias_esponjosas_sangrantes = Column(Boolean, nullable=False)
    lesiones_boca = Column(Boolean, nullable=False)
    encias_palidas = Column(Boolean, nullable=False)
    glositis = Column(Boolean, nullable=False)  
    tiroides_agrandada = Column(Boolean, nullable=False)
    
    paciente = relationship("Paciente", back_populates="examen_fisico")

class Examenes_Bioquimicos(Base): 
    __tablename__ = "examenes_bioquimicos"
    
    id = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("pacientes.id",ondelete="CASCADE"), nullable=False)
    hemoglobina_glicada = Column(Numeric(4, 2), nullable=False)
    glicemia_basal = Column(Integer, nullable=False)    
    colesterol_total = Column(Integer, nullable=False)  
    colesterol_hdl = Column(Integer, nullable=False)    
    colesterol_ldl = Column(Integer, nullable=False)    
    trigliceridos = Column(Integer, nullable=False)
    creatinina = Column(Numeric(4, 2), nullable=False)
    interpretacion_hemoglobina = Column(String, nullable=False)
    interpretacion_glicemia = Column(String, nullable=False)    
    interpretacion_colesterol_total = Column(String, nullable=False)
    interpretacion_colesterol_hdl = Column(String, nullable= False)
    interpretacion_colesterol_ldl = Column(String, nullable= False)
    interpretacion_trigliceridos =  Column(String, nullable= False)
    interpretacion_creatinina = Column(String, nullable=False)  
    
    paciente = relationship("Paciente", back_populates="examenes_bioquimicos")
    
class Frecuencia_Consumo_Alimentos(Base):
    __tablename__ = "frecuencia_consumo_alimentos"
    
    id = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("pacientes.id",ondelete="CASCADE"), nullable=False)
    grupo_alimentos =Column(String, nullable=False) 
    alimento = Column(String, nullable=False)   
    consume_si = Column(Boolean, nullable=False)
    consume_no = Column(Boolean, nullable=False)    
    consume_dia = Column(Boolean, nullable = False ) 
    frecuencia_dia = Column(Boolean, nullable=False)
    frecuencia_semana = Column(Boolean, nullable=False)
    frecuencia_mes = Column(Boolean, nullable=False)   
    clasificacion_poco_frecuente = Column(Boolean, nullable=False)  
    clasificacion_frecuente = Column(Boolean, nullable=False)  
    clasificacion_muy_frecuente = Column(Boolean, nullable=False)   
    
    paciente = relationship("Paciente", back_populates="frecuencia_consumo_alimentos")

class Herramienta_Must(Base):
    __tablename__ = "herramienta_must"
    
    id = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("pacientes.id",ondelete="CASCADE"), nullable=False)
    imc = Column(Numeric(5, 2), nullable=False)
    puntaje_imc = Column(Integer, nullable=False)   
    perdida_peso_porcentaje =  Column(Numeric(5, 2), nullable=False)
    puntaje_perdida_peso = Column(Integer, nullable=False)  
    efecto_enfermedad = Column(Boolean, nullable=False)    
    puntaje_efecto_enfermedad = Column(Integer, nullable = False)
    puntaje_total = Column(Integer, nullable=False) 
    clasificacion_riesgo = Column(String, nullable=False)   
    recomendaciones = Column(String, nullable=False)
    fecha_evaluacion = Column(DateTime, default=datetime.utcnow)

    paciente = relationship("Paciente", back_populates="herramienta_must")


class R24(Base):
    __tablename__ = "r24"

    id = Column(Integer, primary_key=True, index=True)
    id_paciente = Column(Integer, ForeignKey("pacientes.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(Date, nullable=False)
    observaciones = Column(Text)

    paciente = relationship("Paciente", back_populates="r24")
    detalles = relationship("R24Detalle", back_populates="r24")


class R24Detalle(Base):
    __tablename__ = "r24_detalle"

    id = Column(Integer, primary_key=True, index=True)
    id_r24 = Column(Integer, ForeignKey("r24.id",ondelete="CASCADE"), nullable=False)
    tiempo_comida = Column(String(50), nullable=False)
    lugar = Column(String(100))
    hora = Column(Time)
    preparacion = Column(Text)
    alimento_id = Column(Integer, ForeignKey("composicion_alimentos.id"))
    medida_casera = Column(String(100))
    gramos_consumidos = Column(Float)

    r24 = relationship("R24", back_populates="detalles")
    analisis_bioquimico = relationship("AnalisisBioquimicoR24", back_populates="r24_detalle", uselist=False,cascade="all, delete-orphan")
    alimento = relationship("Composicion_Alimentos", back_populates="r24_detalles")

class Categoria(Base): 
    __tablename__ = "categorias"
    id = Column(Integer, primary_key=True, index =  True)
    nombre = Column(String, nullable=False)
    
    composicion_alimentos = relationship("Composicion_Alimentos", back_populates="categoria",cascade="all, delete-orphan")

class Composicion_Alimentos(Base):
    __tablename__ = "composicion_alimentos"
    id = Column(Integer, primary_key=True, index=True)
    idcategoria = Column(Integer, ForeignKey("categorias.id", ondelete="CASCADE"), nullable=False)
    codigo = Column(String, nullable=False)
    nombre = Column(String, nullable=False)
    parte_analizada = Column(String, nullable=False)
    parte_comestible = Column(Float, nullable=False)

    categoria = relationship("Categoria", back_populates="composicion_alimentos")
    analisis_proximal = relationship("AnalisisProximal", uselist=False, back_populates="alimento", cascade="all, delete-orphan")
    minerales = relationship("Minerales", uselist=False, back_populates="alimento", cascade="all, delete-orphan")
    vitaminas = relationship("Vitaminas", uselist=False, back_populates="alimento", cascade="all, delete-orphan")
    acidos_grasos_colesterol = relationship("AcidosGrasosColesterol", uselist=False, back_populates="alimento", cascade="all, delete-orphan")
    r24_detalles = relationship("R24Detalle", back_populates="alimento")


class AnalisisProximal(Base):
    __tablename__ = "analisis_proximal"

    alimento_id = Column(Integer, ForeignKey("composicion_alimentos.id", ondelete="CASCADE"), primary_key=True)
    humedad = Column(Float)
    energia_kcal = Column(Float)
    energia_kj = Column(Float)
    proteina = Column(Float)
    lipidos = Column(Float)
    carbohidratos_total = Column(Float)
    carbohidratos_disponibles = Column(Float)
    fibra_dietetica = Column(Float)
    ceniza = Column(Float)

    alimento = relationship("Composicion_Alimentos", back_populates="analisis_proximal")


class Minerales(Base):
    __tablename__ = "minerales"

    alimento_id = Column(Integer, ForeignKey("composicion_alimentos.id", ondelete="CASCADE"), primary_key=True)
    calcio = Column(Float)
    hierro = Column(Float)
    sodio = Column(Float)
    fosforo = Column(Float)
    yodo = Column(Float)
    zinc = Column(Float)
    magnesio = Column(Float)
    potasio = Column(Float)

    alimento = relationship("Composicion_Alimentos", back_populates="minerales")


class Vitaminas(Base):
    __tablename__ = "vitaminas"

    alimento_id = Column(Integer, ForeignKey("composicion_alimentos.id", ondelete="CASCADE"), primary_key=True)
    tiamina = Column(Float)
    riboflavina = Column(Float)
    niacina = Column(Float)
    folatos = Column(Float)
    vitamina_b12 = Column(Float)
    vitamina_c = Column(Float)
    vitamina_a = Column(Float)

    alimento = relationship("Composicion_Alimentos", back_populates="vitaminas")


class AcidosGrasosColesterol(Base):
    __tablename__ = "acidos_grasos_colesterol"

    alimento_id = Column(Integer, ForeignKey("composicion_alimentos.id", ondelete="CASCADE"), primary_key=True)
    grasa_saturada = Column(Float)
    grasa_monoinsaturada = Column(Float)
    grasa_poliinsaturada = Column(Float)
    colesterol_mg = Column(Float)

    alimento = relationship("Composicion_Alimentos", back_populates="acidos_grasos_colesterol")


class AnalisisBioquimicoR24(Base):
    __tablename__ = "analisis_bioquimico_r24"

    id = Column(Integer, primary_key=True, index=True)
    r24_detalle_id = Column(Integer, ForeignKey("r24_detalle.id", ondelete="CASCADE"), nullable=False)

    proteina = Column(Float)
    grasa_total = Column(Float)
    grasa_saturada = Column(Float)
    grasa_monoinsaturada = Column(Float)
    grasa_poliinsaturada = Column(Float)
    colesterol_mg = Column(Float)
    carbohidratos = Column(Float)
    fibra_dietetica = Column(Float)

    sodio_mg = Column(Float)
    calcio_mg = Column(Float)
    potasio_mg = Column(Float)
    fosforo_mg = Column(Float)
    hierro_mg = Column(Float)
    niacina_mg = Column(Float)
    vitamina_a_ui = Column(Float)
    vitamina_c_mg = Column(Float)

    r24_detalle = relationship("R24Detalle", back_populates="analisis_bioquimico")

class ListaIntercambios(Base):
    __tablename__ = "lista_intercambios"

    id = Column(Integer, primary_key=True, index=True)
    grupo_alimento_id = Column(Integer, ForeignKey("grupos_alimentos.id"), nullable=False)
    alimento = Column(String, nullable=False)
    gramos = Column(Integer, nullable=False)
    unidad_medida = Column(String, nullable=False)
    kcal = Column(Integer, nullable=False)
    proteina_g = Column(Float)
    grasa_total_g = Column(Float)
    ags_g = Column(Float)
    agmi_g = Column(Float)
    agpi_g = Column(Float)
    col_mg = Column(Float)
    cho_g = Column(Float)
    fibra_dietetica_g = Column(Float)
    calcio_mg = Column(Float)
    fosforo_mg = Column(Float)
    hierro_mg = Column(Float)
    sodio_mg = Column(Float)
    potasio_mg = Column(Float)
    magnesio_mg = Column(Float)
    zinc_mg = Column(Float)
    cobre_mg = Column(Float)
    manganeso_mg = Column(Float)
    vita_er_ug = Column(Float)
    tiamina_mg = Column(Float)
    riboflavina_mg = Column(Float)
    niacina_mg = Column(Float)
    acido_pantotenico_mg = Column(Float)
    vitb6_mg = Column(Float)  
    folato_efd_ug = Column(Float)
    vitb12_mcg = Column(Float)
    vitc_mg = Column(Float)