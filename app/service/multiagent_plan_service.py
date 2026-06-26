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
    Composicion_Alimentos,
    ListaIntercambios,
    EvaluacionAntropometrica,
)
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL")

if not GOOGLE_API_KEY:
    raise RuntimeError("Falta configurar GOOGLE_API_KEY en el archivo .env")

chat = ChatGoogleGenerativeAI(
    model=GEMINI_MODEL,
    google_api_key=GOOGLE_API_KEY,
    temperature=0.4,
)


def safe(value: Any, default: str = "No reportado") -> Any:
    return value if value not in [None, ""] else default


def boolean_str(value: Any) -> str:
    if value is None or value == "":
        return "No reportado"
    return "Sí" if bool(value) else "No"


def invoke_agent(system_prompt: str, human_prompt: str, agent_name: str) -> str:
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", human_prompt),
        ]
    )

    chain = prompt | chat
    response = chain.invoke({})

    content = getattr(response, "content", None)
    if not content or not str(content).strip():
        raise ValueError(f"La respuesta del agente {agent_name} es vacía.")

    return str(content).strip()


def analizar_datos_clinicos(paciente_id: int) -> str:
    db: Session = SessionLocal()

    try:
        paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
        if not paciente:
            return "Paciente no encontrado."

        antropometria = (
            db.query(EvaluacionAntropometrica)
            .filter(EvaluacionAntropometrica.id_paciente == paciente_id)
            .order_by(EvaluacionAntropometrica.fecha_registro.desc())
            .first()
            or EvaluacionAntropometrica()
        )

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

        frecuencia = (
            db.query(Frecuencia_Consumo_Alimentos)
            .filter(Frecuencia_Consumo_Alimentos.id_paciente == paciente_id)
            .all()
        )

        resumen_frecuencia = ""
        for f in frecuencia:
            resumen_frecuencia += (
                f"- {safe(f.grupo_alimentos)}: {safe(f.alimento)} -> "
                f"{'Consume' if f.consume_si else 'No consume'}, "
                f"Frecuencia: "
                f"{'Día' if f.frecuencia_dia else ''} "
                f"{'Semana' if f.frecuencia_semana else ''} "
                f"{'Mes' if f.frecuencia_mes else ''} -> "
                f"{'Muy frecuente' if f.clasificacion_muy_frecuente else 'Frecuente' if f.clasificacion_frecuente else 'Poco frecuente' if f.clasificacion_poco_frecuente else 'No clasificado'}\n"
            )

        system_prompt = """
Eres un nutricionista clínico. Tu tarea es generar un resumen clínico-nutricional útil para construir un plan alimentario.

Incluye:
- Estado antropométrico.
- Riesgo nutricional.
- Perfil bioquímico.
- Antecedentes relevantes.
- Circunstancias sociales o económicas.
- Examen físico.
- Datos alimentarios.
- Frecuencia de consumo.

No inventes datos. Si falta información, marca como no reportado.
Sé claro, organizado y clínicamente prudente.
"""

        human_prompt = f"""
INFORMACIÓN DEL PACIENTE:
Nombre: {safe(paciente.nombre_completo)}
Edad: {safe(paciente.edad)}
Sexo: {safe(paciente.sexo)}
Peso actual: {safe(antropometria.peso_actual)} kg
Peso usual: {safe(antropometria.peso_usual)} kg
Talla: {safe(antropometria.talla)} cm
IMC: {safe(antropometria.ind_masa_corporal)} ({safe(paciente.clasificacion_imc)})
Cintura: {safe(antropometria.circunferencia_cintura)} cm ({safe(paciente.clasificacion_circunferencia)})

EXÁMENES BIOQUÍMICOS:
Glicemia: {safe(bioquimico.glicemia_basal)} mg/dL ({safe(bioquimico.interpretacion_glicemia)})
Hemoglobina glicada: {safe(bioquimico.hemoglobina_glicada)} ({safe(bioquimico.interpretacion_hemoglobina)})
Colesterol total: {safe(bioquimico.colesterol_total)} ({safe(bioquimico.interpretacion_colesterol_total)})
HDL: {safe(bioquimico.colesterol_hdl)} ({safe(bioquimico.interpretacion_colesterol_hdl)})
LDL: {safe(bioquimico.colesterol_ldl)} ({safe(bioquimico.interpretacion_colesterol_ldl)})
Triglicéridos: {safe(bioquimico.trigliceridos)} ({safe(bioquimico.interpretacion_trigliceridos)})
Creatinina: {safe(bioquimico.creatinina)} ({safe(bioquimico.interpretacion_creatinina)})

ANTECEDENTES:
HTA personal: {boolean_str(antecedentes.hipertension_personal)}
Diabetes personal: {boolean_str(antecedentes.diabetes_personal)}
Enfermedad cardiovascular personal: {boolean_str(antecedentes.enfermedad_cardiovascular_personal)}
Enfermedad gastrointestinal personal: {boolean_str(antecedentes.enfermedad_gastrointestinal_personal)}
HTA familiar: {boolean_str(antecedentes.hipertension_familiar)}
Diabetes familiar: {boolean_str(antecedentes.diabetes_familiar)}
Quirúrgicos: {safe(antecedentes.quirurgicos)}

CONDICIONES AMBIENTALES:
Alcoholismo: {boolean_str(circunstancia.alcoholismo)}
Abuso de drogas: {boolean_str(circunstancia.abuso_drogas)}
Limitaciones económicas: {boolean_str(circunstancia.limitaciones_economicas)}

EXAMEN FÍSICO:
Palidez: {boolean_str(examen_fisico.palidez)}
Glositis: {boolean_str(examen_fisico.glositis)}
Dermatitis: {boolean_str(examen_fisico.dermatitis)}
Alopecia: {boolean_str(examen_fisico.alopecia)}

DATOS ALIMENTARIOS:
Intolerancias: {boolean_str(datos_alimentarios.intolerancia_alimentos)} -> {safe(datos_alimentarios.alimentos_intolerancia)}
Problemas digestivos: {boolean_str(datos_alimentarios.problemas_digestivos)} -> {safe(datos_alimentarios.tipo_problema_digestivo)}
Frecuencia de comida: {safe(datos_alimentarios.frecuencia_comida)}
Medicamentos: {safe(datos_alimentarios.lista_medicamentos)}
Suplementos: {boolean_str(datos_alimentarios.toma_suplementos)}
Agrega sal: {boolean_str(datos_alimentarios.agrega_sal)}
Alimentos preferidos: {safe(datos_alimentarios.alimentos_agradan)}
Alimentos no preferidos: {safe(datos_alimentarios.alimentos_no_agradan)}

FRECUENCIA DE CONSUMO:
{resumen_frecuencia if resumen_frecuencia else "No se ha registrado frecuencia de consumo."}

HERRAMIENTA MUST:
IMC: {safe(must.imc)} ({safe(must.puntaje_imc)} pts)
Pérdida de peso: {safe(must.perdida_peso_porcentaje)}% ({safe(must.puntaje_perdida_peso)} pts)
Efecto enfermedad: {boolean_str(must.efecto_enfermedad)} ({safe(must.puntaje_efecto_enfermedad)} pts)
Total: {safe(must.puntaje_total)}
Riesgo: {safe(must.clasificacion_riesgo)}
Recomendaciones: {safe(must.recomendaciones)}
"""

        print("Analizando datos clínicos completos del paciente...")
        return invoke_agent(system_prompt, human_prompt, "clínico")

    finally:
        db.close()


def obtener_resumen_local_alimentos() -> str:
    db: Session = SessionLocal()

    try:
        alimentos = db.query(Composicion_Alimentos).limit(20).all()

        if not alimentos:
            return "No hay alimentos registrados. Usar alimentos comunes y económicos."

        resumen = ""
        for alimento in alimentos:
            nombre = safe(alimento.nombre)
            categoria = alimento.categoria.nombre if getattr(alimento, "categoria", None) else "Sin categoría"
            prox = getattr(alimento, "analisis_proximal", None)

            resumen += (
                f"- {nombre} ({categoria}): "
                f"{safe(prox.energia_kcal if prox else None)} kcal, "
                f"{safe(prox.proteina if prox else None)} g proteína, "
                f"{safe(prox.carbohidratos_disponibles if prox else None)} g carbohidratos.\n"
            )

        return resumen

    finally:
        db.close()


def obtener_resumen_local_intercambios() -> str:
    db: Session = SessionLocal()

    try:
        lista = db.query(ListaIntercambios).limit(30).all()

        if not lista:
            return "No hay lista de intercambios registrada. Usar equivalencias alimentarias generales."

        resumen = ""
        for item in lista:
            resumen += (
                f"- {safe(item.alimento)}: {safe(item.gramos)} g, "
                f"{safe(item.kcal)} kcal, "
                f"{safe(item.proteina_g)} g proteína, "
                f"{safe(item.cho_g)} g CHO, "
                f"{safe(item.grasa_total_g)} g grasa.\n"
            )

        return resumen

    finally:
        db.close()


def generar_plan_nutricional(
    resumen_clinico: str,
    alimentos: str,
    objetivo: str,
    intercambios: str,
) -> str:
    system_prompt = """
Eres un nutricionista clínico experto en planificación alimentaria.

Genera un plan alimentario personalizado semanal de 7 días.

Reglas:
- Debe tener 5 tiempos de comida por día:
  desayuno, media mañana, almuerzo, media tarde y cena.
- Usa porciones claras: gramos, tazas, cucharadas, unidades o piezas.
- Considera objetivo, estado clínico, preferencias, intolerancias y limitaciones económicas.
- Usa los alimentos disponibles y las equivalencias si son útiles.
- No inventes diagnósticos ni datos clínicos.
- Si falta información, genera un plan conservador.
- El plan es una ayuda para el nutricionista, no reemplaza criterio profesional.

Estructura:
1. Introducción personalizada.
2. Plan Día 1 al Día 7.
3. Recomendaciones finales.
4. Observaciones para seguimiento.
"""

    human_prompt = f"""
OBJETIVO DEL PACIENTE:
{objetivo}

RESUMEN CLÍNICO:
{resumen_clinico}

ALIMENTOS DISPONIBLES O REFERENCIA:
{alimentos}

LISTA DE INTERCAMBIOS O REFERENCIA:
{intercambios}
"""

    print("Generando plan semanal detallado...")
    return invoke_agent(system_prompt, human_prompt, "planificador")


def evaluar_plan_nutricional(plan_generado: str, resumen_clinico: str, objetivo: str) -> str:
    return (
        "Evaluación automática desactivada en modo gratuito para evitar exceder la cuota de Gemini. "
        "Se recomienda revisión final por parte del nutricionista."
    )


def corregir_plan_nutricional(plan: str, evaluacion: str, objetivo: str) -> str:
    return plan


def generar_plan_multiagente(paciente_id: int, objetivo: str) -> dict:
    if not objetivo or not objetivo.strip():
        raise ValueError("El objetivo nutricional es obligatorio.")

    resumen_clinico = analizar_datos_clinicos(paciente_id)

    if resumen_clinico == "Paciente no encontrado.":
        raise ValueError("Paciente no encontrado.")

    alimentos = obtener_resumen_local_alimentos()
    intercambios = obtener_resumen_local_intercambios()

    plan = generar_plan_nutricional(
        resumen_clinico=resumen_clinico,
        alimentos=alimentos,
        objetivo=objetivo,
        intercambios=intercambios,
    )

    evaluacion = evaluar_plan_nutricional(
        plan_generado=plan,
        resumen_clinico=resumen_clinico,
        objetivo=objetivo,
    )

    return {
        "plan_simplificado": plan,
        "evaluacion": evaluacion,
    }