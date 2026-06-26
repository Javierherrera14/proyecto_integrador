import os
from typing import Any
from datetime import datetime

from dotenv import load_dotenv
from sqlalchemy.orm import Session
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable, GoogleAPIError

from app.database import SessionLocal
from app.models.models import (
    Paciente,
    Herramienta_Must,
    Antecedentes_Patologicos,
    Circunstancias_Ambientales,
    Examen_Fisico,
    Examenes_Bioquimicos,
    Datos_Alimentarios,
    EvaluacionAntropometrica,
    PlanNutricional
)
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not GOOGLE_API_KEY:
    raise RuntimeError("Falta configurar GOOGLE_API_KEY en el archivo .env")

chat = ChatGoogleGenerativeAI(
    model=GEMINI_MODEL,
    google_api_key=GOOGLE_API_KEY,
    temperature=0.4,
)

def safe(value: Any, default: str = "No reportado") -> Any:
    return value if value not in [None, ""] else default

# =====================================================================
# REQUISITO 2: IMPLEMENTACIÓN DE RETRIES (Tolerancia a fallos con Gemini)
# =====================================================================
@retry(
    stop=stop_after_attempt(3), # Reintenta hasta 3 veces
    wait=wait_exponential(multiplier=1, min=2, max=10), # Espera exponencial (2s, 4s, 8s)
    retry=retry_if_exception_type((ResourceExhausted, ServiceUnavailable, GoogleAPIError, Exception)),
    reraise=True
)
def invocar_gemini_con_reintento(chain, prompt_kwargs):
    print("Invocando a Gemini (con política de reintentos)...")
    response = chain.invoke(prompt_kwargs)
    content = getattr(response, "content", None)
    if not content or not str(content).strip():
        raise ValueError("La respuesta de Gemini no contiene contenido válido.")
    return str(content).strip()


def generar_plan_nutricional_con_gemini(paciente_id: int, objetivo: str) -> str:
    if not objetivo or not objetivo.strip():
        raise ValueError("El objetivo nutricional es obligatorio.")

    db: Session = SessionLocal()

    try:
        # =====================================================================
        # REQUISITO 1: OPTIMIZACIÓN DE CONSULTAS (Uso de relaciones de SQLAlchemy)
        # =====================================================================
        # Hacemos una única query principal a la base de datos
        paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()

        if not paciente:
            return "Paciente no encontrado."

        # Navegamos en memoria usando las relaciones de SQLAlchemy para evitar múltiples llamadas
        antropometria = paciente.evaluaciones_antropometricas[-1] if paciente.evaluaciones_antropometricas else EvaluacionAntropometrica()
        must = paciente.herramienta_must[0] if paciente.herramienta_must else Herramienta_Must()
        antecedentes = paciente.antecedentes_patologicos[0] if paciente.antecedentes_patologicos else Antecedentes_Patologicos()
        frecuencia = paciente.frecuencia_consumo_alimentos
        circunstancia = paciente.circunstancias_ambientales[0] if paciente.circunstancias_ambientales else Circunstancias_Ambientales()
        examen_fisico = paciente.examen_fisico[0] if paciente.examen_fisico else Examen_Fisico()
        bioquimico = paciente.examenes_bioquimicos[0] if paciente.examenes_bioquimicos else Examenes_Bioquimicos()
        datos_alimentarios = paciente.datos_alimentarios[0] if paciente.datos_alimentarios else Datos_Alimentarios()

        alimentos_consumidos = [
            f"- {safe(f.alimento, 'Alimento desconocido')} ({safe(f.grupo_alimentos, 'Grupo desconocido')})"
            for f in frecuencia
            if f.consume_si
        ]
        lista_alimentos = "\n".join(alimentos_consumidos) or "No reportado"

        system_prompt = """
Eres un nutricionista clínico experto en planificación alimentaria.
Tu tarea es generar un plan alimenticio personalizado, organizado por semana completa de 7 días, considerando datos clínicos, bioquímicos, contexto socioeconómico, preferencias personales y objetivo del paciente.

Reglas importantes:
- No inventes patologías, medicamentos, diagnósticos ni restricciones no reportadas.
- Si falta información clínica, dilo de forma breve y genera un plan conservador.
- Usa alimentos comunes, realistas y porciones claras.
- Considera intolerancias, medicamentos, preferencias, alimentos no preferidos y limitaciones económicas si aparecen en los datos.
- El plan debe ser una guía de apoyo para el nutricionista, no reemplaza el criterio profesional.

Estructura obligatoria:
1. Introducción personalizada con nombre del paciente y objetivo.
2. Plan semanal del Día 1 al Día 7.
3. Cada día debe tener 5 tiempos de comida:
   - Desayuno
   - Media mañana
   - Almuerzo
   - Media tarde
   - Cena
4. Cada tiempo debe incluir porciones específicas en gramos, tazas, cucharadas, unidades o piezas.
5. Recomendaciones finales de hidratación, horarios, adherencia y seguimiento.
6. Cierre profesional.
"""

        human_prompt = f"""
OBJETIVO DEL PACIENTE:
{safe(objetivo)}

DATOS PERSONALES:
- Nombre: {safe(paciente.nombre_completo)}
- Edad: {safe(paciente.edad)}
- Sexo: {safe(paciente.sexo)}

DATOS ANTROPOMÉTRICOS:
- Peso actual: {safe(antropometria.peso_actual)} kg
- Peso usual: {safe(antropometria.peso_usual)} kg
- Talla: {safe(antropometria.talla)} cm
- IMC: {safe(antropometria.ind_masa_corporal)} ({safe(paciente.clasificacion_imc)})
- Circunferencia cintura: {safe(antropometria.circunferencia_cintura)} cm ({safe(paciente.clasificacion_circunferencia)})

HERRAMIENTA MUST:
- IMC MUST: {safe(must.imc)}
- Puntaje IMC: {safe(must.puntaje_imc)}
- Pérdida de peso: {safe(must.perdida_peso_porcentaje)}%
- Puntaje pérdida de peso: {safe(must.puntaje_perdida_peso)}
- Efecto enfermedad: {safe(must.efecto_enfermedad)}
- Puntaje total: {safe(must.puntaje_total)}
- Riesgo: {safe(must.clasificacion_riesgo)}
- Recomendaciones MUST: {safe(must.recomendaciones)}

EXÁMENES BIOQUÍMICOS:
- Hemoglobina glicada: {safe(bioquimico.hemoglobina_glicada)} % ({safe(bioquimico.interpretacion_hemoglobina)})
- Glicemia basal: {safe(bioquimico.glicemia_basal)} mg/dL ({safe(bioquimico.interpretacion_glicemia)})
- Colesterol total: {safe(bioquimico.colesterol_total)} mg/dL ({safe(bioquimico.interpretacion_colesterol_total)})
- HDL: {safe(bioquimico.colesterol_hdl)} mg/dL ({safe(bioquimico.interpretacion_colesterol_hdl)})
- LDL: {safe(bioquimico.colesterol_ldl)} mg/dL ({safe(bioquimico.interpretacion_colesterol_ldl)})
- Triglicéridos: {safe(bioquimico.trigliceridos)} mg/dL ({safe(bioquimico.interpretacion_trigliceridos)})
- Creatinina: {safe(bioquimico.creatinina)} mg/dL ({safe(bioquimico.interpretacion_creatinina)})

ANTECEDENTES:
- Hipertensión personal: {safe(antecedentes.hipertension_personal)}
- Diabetes personal: {safe(antecedentes.diabetes_personal)}
- Enfermedad cardiovascular personal: {safe(antecedentes.enfermedad_cardiovascular_personal)}
- Enfermedad gastrointestinal personal: {safe(antecedentes.enfermedad_gastrointestinal_personal)}
- Diabetes familiar: {safe(antecedentes.diabetes_familiar)}
- Hipertensión familiar: {safe(antecedentes.hipertension_familiar)}
- Quirúrgicos: {safe(antecedentes.quirurgicos)}

CIRCUNSTANCIAS AMBIENTALES Y SOCIALES:
- Limitaciones económicas: {safe(circunstancia.limitaciones_economicas)}
- Alcoholismo: {safe(circunstancia.alcoholismo)}
- Abuso de drogas: {safe(circunstancia.abuso_drogas)}

EXAMEN FÍSICO:
- Palidez: {safe(examen_fisico.palidez)}
- Glositis: {safe(examen_fisico.glositis)}
- Dermatitis/lesiones en piel: {safe(examen_fisico.dermatitis)}
- Alopecia/caída de cabello: {safe(examen_fisico.alopecia)}

DATOS ALIMENTARIOS:
- Intolerancias: {safe(datos_alimentarios.intolerancia_alimentos)} ({safe(datos_alimentarios.alimentos_intolerancia)})
- Problemas digestivos: {safe(datos_alimentarios.problemas_digestivos)} ({safe(datos_alimentarios.tipo_problema_digestivo)})
- Medicamentos: {safe(datos_alimentarios.lista_medicamentos)}
- Suplementos: {safe(datos_alimentarios.toma_suplementos)}
- Frecuencia de comida: {safe(datos_alimentarios.frecuencia_comida)}
- Agrega sal: {safe(datos_alimentarios.agrega_sal)}
- Alimentos preferidos: {safe(datos_alimentarios.alimentos_agradan)}
- Alimentos no preferidos: {safe(datos_alimentarios.alimentos_no_agradan)}

ALIMENTOS CONSUMIDOS FRECUENTEMENTE:
{lista_alimentos}
"""

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", human_prompt),
            ]
        )

        chain = prompt | chat

        # Llamada a IA encapsulada en la función con decorador Tenacity
        plan_contenido = invocar_gemini_con_reintento(chain, {})

        # =====================================================================
        # REQUISITO 3: PERSISTENCIA DEL PLAN EN BASE DE DATOS
        # =====================================================================
        nuevo_plan = PlanNutricional(
            id_paciente=paciente_id,
            objetivo=objetivo,
            contenido=plan_contenido,
            fecha_creacion=datetime.utcnow()
        )
        db.add(nuevo_plan)
        db.commit()
        db.refresh(nuevo_plan)
        print(f"✅ Plan guardado exitosamente en DB con ID: {nuevo_plan.id}")

        return plan_contenido

    except Exception as e:
        print(f"❌ Error al generar o guardar el plan: {e}")
        raise RuntimeError(f"Error interno al generar el plan: {e}") from e

    finally:
        db.close()