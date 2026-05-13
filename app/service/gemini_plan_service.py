import os
from typing import Any

from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.models import (
    Paciente,
    Herramienta_Must,
    Frecuencia_Consumo_Alimentos,
    Antecedentes_Patologicos,
    Circunstancias_Ambientales,
    Examen_Fisico,
    Examenes_Bioquimicos,
    Datos_Alimentarios,
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


def generar_plan_nutricional_con_gemini(paciente_id: int, objetivo: str) -> str:
    if not objetivo or not objetivo.strip():
        raise ValueError("El objetivo nutricional es obligatorio.")

    db: Session = SessionLocal()

    try:
        paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()

        if not paciente:
            return "Paciente no encontrado."

        must = (
            db.query(Herramienta_Must)
            .filter(Herramienta_Must.id_paciente == paciente_id)
            .first()
            or Herramienta_Must()
        )
        antecedentes = (
            db.query(Antecedentes_Patologicos)
            .filter(Antecedentes_Patologicos.id_paciente == paciente_id)
            .first()
            or Antecedentes_Patologicos()
        )
        frecuencia = (
            db.query(Frecuencia_Consumo_Alimentos)
            .filter(Frecuencia_Consumo_Alimentos.id_paciente == paciente_id)
            .all()
        )
        circunstancia = (
            db.query(Circunstancias_Ambientales)
            .filter(Circunstancias_Ambientales.id_paciente == paciente_id)
            .first()
            or Circunstancias_Ambientales()
        )
        examen_fisico = (
            db.query(Examen_Fisico)
            .filter(Examen_Fisico.id_paciente == paciente_id)
            .first()
            or Examen_Fisico()
        )
        bioquimico = (
            db.query(Examenes_Bioquimicos)
            .filter(Examenes_Bioquimicos.id_paciente == paciente_id)
            .first()
            or Examenes_Bioquimicos()
        )
        datos_alimentarios = (
            db.query(Datos_Alimentarios)
            .filter(Datos_Alimentarios.paciente_id == paciente_id)
            .first()
            or Datos_Alimentarios()
        )

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
- Peso actual: {safe(paciente.peso_actual)} kg
- Peso usual: {safe(paciente.peso_usual)} kg
- Talla: {safe(paciente.talla)} cm
- IMC: {safe(paciente.ind_masa_corporal)} ({safe(paciente.clasificacion_imc)})
- Circunferencia cintura: {safe(paciente.circunferencia_cintura)} cm ({safe(paciente.clasificacion_circunferencia)})

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

        print("Generando plan nutricional con Gemini...")
        response = chain.invoke({})

        content = getattr(response, "content", None)
        if not content or not str(content).strip():
            raise ValueError("La respuesta de Gemini no contiene contenido válido.")

        return str(content).strip()

    except Exception as e:
        print(f"Error al invocar Gemini: {e}")
        raise RuntimeError(f"Error interno al generar el plan: {e}") from e

    finally:
        db.close()
