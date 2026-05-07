import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import (
    Paciente, Herramienta_Must, Frecuencia_Consumo_Alimentos,
    Antecedentes_Patologicos, Circunstancias_Ambientales,
    Examen_Fisico, Examenes_Bioquimicos, Datos_Alimentarios,
    Composicion_Alimentos, AnalisisProximal, Minerales,
    Vitaminas, AcidosGrasosColesterol, R24Detalle
)
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

load_dotenv()
chat = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=os.getenv("GOOGLE_API_KEY"))

# 🩺 Agente 1: Analizador de datos clínicos
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import *
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()
chat = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=os.getenv("GOOGLE_API_KEY"))

def analizar_datos_clinicos(paciente_id: int) -> str:
    db: Session = SessionLocal()

    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    must = db.query(Herramienta_Must).filter(Herramienta_Must.id_paciente == paciente_id).first()
    antecedentes = db.query(Antecedentes_Patologicos).filter(Antecedentes_Patologicos.id_paciente == paciente_id).first()
    circunstancia = db.query(Circunstancias_Ambientales).filter(Circunstancias_Ambientales.id_paciente == paciente_id).first()
    examen_fisico = db.query(Examen_Fisico).filter(Examen_Fisico.id_paciente == paciente_id).first()
    bioquimico = db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id_paciente == paciente_id).first()
    datos_alimentarios = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.paciente_id == paciente_id).first()
    frecuencia = db.query(Frecuencia_Consumo_Alimentos).filter(Frecuencia_Consumo_Alimentos.id_paciente == paciente_id).all()

    if not paciente:
        return "Paciente no encontrado."

    def safe(value):
        return value if value not in [None, "", 0] else "No reportado"

    def boolean_str(value):
        return "Sí" if value else "No"

    # Armar tabla resumen de frecuencia de alimentos
    resumen_frecuencia = ""
    for f in frecuencia:
        resumen_frecuencia += (
            f"- {f.grupo_alimentos}: {f.alimento} → "
            f"{'✅ Consume' if f.consume_si else '❌ No consume'}, Frecuencia: "
            f"{'Día' if f.frecuencia_dia else ''} "
            f"{'Semana' if f.frecuencia_semana else ''} "
            f"{'Mes' if f.frecuencia_mes else ''} → "
            f"{'Muy frecuente' if f.clasificacion_muy_frecuente else 'Frecuente' if f.clasificacion_frecuente else 'Poco frecuente' if f.clasificacion_poco_frecuente else 'No clasificado'}\n"
        )

    system_prompt = SystemMessagePromptTemplate.from_template("""
Eres un nutricionista clínico. Tu tarea es generar un **informe clínico-nutricional detallado** del paciente con base en la información proporcionada. Incluye:

- Estado antropométrico y riesgo nutricional
- Perfil bioquímico e interpretaciones
- Todos los antecedentes personales y familiares
- Condiciones ambientales y sociales que afecten la nutrición
- Examen físico completo
- Datos alimentarios y frecuencia de consumo
""")

    human_prompt = HumanMessagePromptTemplate.from_template(f"""
📌 INFORMACIÓN DEL PACIENTE:
Nombre: {safe(paciente.nombre_completo)}, Edad: {safe(paciente.edad)}, Sexo: {safe(paciente.sexo)}
Peso actual: {safe(paciente.peso_actual)} kg, Peso usual: {safe(paciente.peso_usual)} kg
Talla: {safe(paciente.talla)} cm, IMC: {safe(paciente.ind_masa_corporal)} ({safe(paciente.clasificacion_imc)})
Cintura: {safe(paciente.circunferencia_cintura)} cm ({safe(paciente.clasificacion_circunferencia)})

🧪 EXÁMENES BIOQUÍMICOS:
Glicemia: {safe(bioquimico.glicemia_basal)} mg/dL ({safe(bioquimico.interpretacion_glicemia)})
Colesterol total: {safe(bioquimico.colesterol_total)} mg/dL ({safe(bioquimico.interpretacion_colesterol_total)})
HDL: {safe(bioquimico.colesterol_hdl)} ({safe(bioquimico.interpretacion_colesterol_hdl)}), LDL: {safe(bioquimico.colesterol_ldl)} ({safe(bioquimico.interpretacion_colesterol_ldl)})
Triglicéridos: {safe(bioquimico.trigliceridos)} ({safe(bioquimico.interpretacion_trigliceridos)}), Creatinina: {safe(bioquimico.creatinina)} ({safe(bioquimico.interpretacion_creatinina)})

🩺 ANTECEDENTES:
Personales: HTA: {boolean_str(antecedentes.hipertension_personal)}, Diabetes: {boolean_str(antecedentes.diabetes_personal)}, CV: {boolean_str(antecedentes.enfermedad_cardiovascular_personal)}, GI: {boolean_str(antecedentes.enfermedad_gastrointestinal_personal)}, Quirúrgicos: {safe(antecedentes.quirurgicos)}
Familiares: HTA: {boolean_str(antecedentes.hipertension_familiar)}, Diabetes: {boolean_str(antecedentes.diabetes_familiar)}

🌿 CONDICIONES AMBIENTALES:
Alcoholismo: {boolean_str(circunstancia.alcoholismo)}, Drogas: {boolean_str(circunstancia.abuso_drogas)}, Limitaciones económicas: {boolean_str(circunstancia.limitaciones_economicas)}

🧍 EXAMEN FÍSICO:
Palidez: {boolean_str(examen_fisico.palidez)}, Glositis: {boolean_str(examen_fisico.glositis)}, Lesiones en piel: {boolean_str(examen_fisico.dermatitis)}, Caída de cabello: {boolean_str(examen_fisico.alopecia)}

🍽️ DATOS ALIMENTARIOS:
Intolerancias: {boolean_str(datos_alimentarios.intolerancia_alimentos)} → {safe(datos_alimentarios.alimentos_intolerancia)}
Problemas digestivos: {boolean_str(datos_alimentarios.problemas_digestivos)} → {safe(datos_alimentarios.tipo_problema_digestivo)}
Frecuencia de comida: {safe(datos_alimentarios.frecuencia_comida)}, Medicamentos: {safe(datos_alimentarios.lista_medicamentos)}
Suplementos: {boolean_str(datos_alimentarios.toma_suplementos)}, Agrega sal: {boolean_str(datos_alimentarios.agrega_sal)}

🍎 FRECUENCIA DE CONSUMO DE ALIMENTOS:
{resumen_frecuencia if resumen_frecuencia else 'No se ha registrado frecuencia de consumo.'}

📉 HERRAMIENTA MUST:
IMC: {safe(must.imc)} ({safe(must.puntaje_imc)} pts), Pérdida peso: {safe(must.perdida_peso_porcentaje)}% ({safe(must.puntaje_perdida_peso)} pts)
Efecto enfermedad: {boolean_str(must.efecto_enfermedad)} ({safe(must.puntaje_efecto_enfermedad)} pts)
Total: {safe(must.puntaje_total)} → Riesgo: {safe(must.clasificacion_riesgo)}
Recomendaciones: {safe(must.recomendaciones)}
""")

    messages = ChatPromptTemplate.from_messages([
        system_prompt,
        human_prompt
    ]).format_messages()

    print("📋 Analizando datos clínicos completos del paciente...")
    respuesta = chat.invoke(messages)

    if not respuesta or not hasattr(respuesta, "content") or not respuesta.content.strip():
        raise ValueError("La respuesta del agente clínico es vacía.")

    return respuesta.content


# 🧬 Agente 2: Analizador de alimentos disponibles
def analizar_alimentos_disponibles(objetivo: str) -> str:
    db: Session = SessionLocal()
    alimentos = db.query(Composicion_Alimentos).all()
    if not alimentos:
        return "No hay alimentos registrados."

    resumen = ""
    for alimento in alimentos[:30]:
        nombre = alimento.nombre
        categoria = alimento.categoria.nombre if alimento.categoria else "Sin categoría"
        prox = alimento.analisis_proximal
        mins = alimento.minerales
        vits = alimento.vitaminas
        grasas = alimento.acidos_grasos_colesterol

        resumen += f"""
🍴 **{nombre}** ({categoria})
- Energía: {prox.energia_kcal if prox else "N/A"} kcal
- Proteína: {prox.proteina if prox else "N/A"} g
- Carbohidratos: {prox.carbohidratos_disponibles if prox else "N/A"} g
- Grasas saturadas: {grasas.grasa_saturada if grasas else "N/A"} g
- Hierro: {mins.hierro if mins else "N/A"} mg
- Vitamina C: {vits.vitamina_c if vits else "N/A"} mg
        """ + "\n\n"

    system_prompt = SystemMessagePromptTemplate.from_template("""
Eres un nutricionista experto en composición de alimentos. Recibes una lista de alimentos disponibles y el objetivo nutricional del paciente.
Tu tarea es identificar cuáles alimentos son útiles para ese objetivo (ej: pérdida de peso, ganancia muscular, etc.) y preparar un resumen práctico para el planificador.
No repitas todos los datos, extrae lo útil y agrúpalo.
""")

    human_prompt = HumanMessagePromptTemplate.from_template(f"""
🎯 OBJETIVO DEL PACIENTE: {objetivo}
📚 ALIMENTOS Y SU COMPOSICIÓN:
{resumen}
""")

    messages = ChatPromptTemplate.from_messages([
        system_prompt,
        human_prompt
    ]).format_messages()

    print("📋 Analizando alimentos disponibles...")
    respuesta = chat.invoke(messages)

    if not respuesta or not hasattr(respuesta, "content") or not respuesta.content.strip():
        raise ValueError("La respuesta del agente de alimentos es vacía.")

    return respuesta.content

#agente 3 analizador lista intercambi0
def analizar_lista_intercambios() -> str:
    db: Session = SessionLocal()
    lista = db.query(ListaIntercambios).limit(100).all()  # Puedes ajustar el límite si lo deseas

    if not lista:
        return "No hay datos registrados en la lista de intercambios."

    resumen = ""
    for item in lista:
        resumen += f"""
🍽️ **{item.alimento}** ({item.gramos} g, {item.unidad_medida})
- Energía: {item.kcal} kcal
- Proteína: {item.proteina_g} g
- Grasas totales: {item.grasa_total_g} g
- CHO: {item.cho_g} g
- Fibra: {item.fibra_dietetica_g} g
- Sodio: {item.sodio_mg} mg
- Vitamina C: {item.vitc_mg} mg
- Hierro: {item.hierro_mg} mg
        """ + "\n"

    system_prompt = SystemMessagePromptTemplate.from_template("""
Eres un nutricionista especializado en listas de intercambios alimentarios.

Tu tarea es procesar la siguiente información nutricional de una lista de alimentos y extraer patrones útiles, grupos comunes y observaciones relevantes para ayudar al planificador a seleccionar combinaciones apropiadas de alimentos por grupos.

Identifica alimentos con alto valor nutricional, intercambiables y aquellos con limitaciones (por ejemplo, alto sodio).
""")

    human_prompt = HumanMessagePromptTemplate.from_template(f"""
📚 LISTA DE INTERCAMBIOS:
{resumen}
""")

    messages = ChatPromptTemplate.from_messages([
        system_prompt,
        human_prompt
    ]).format_messages()

    print("📦 Analizando lista de intercambios...")
    respuesta = chat.invoke(messages)

    if not respuesta or not hasattr(respuesta, "content") or not respuesta.content.strip():
        raise ValueError("La respuesta del agente de intercambios es vacía.")

    return respuesta.content


# 📋 Agente 4: Planificador nutricional
def generar_plan_nutricional(resumen_clinico: str, alimentos: str, objetivo: str, intercambios: str) -> str:
    system_prompt = SystemMessagePromptTemplate.from_template("""
Eres un nutricionista clínico que genera planes de alimentación semanales personalizados para pacientes.

Tu tarea es crear un plan semanal (7 días), incluyendo:

✅ 5 tiempos de comida por día: desayuno, media mañana, almuerzo, media tarde y cena  
✅ Ingredientes comunes y disponibles según la lista proporcionada  
✅ Usa también información de la lista de intercambios para combinar alimentos nutricionalmente equivalentes  
✅ Porciones **claras** usando unidades como gramos, tazas, cucharadas, piezas, etc.  
✅ Ajuste del plan al **objetivo del paciente** y su estado clínico  

Usa una estructura clara, títulos por día y tiempo de comida. Finaliza con recomendaciones.
""")

    human_prompt = HumanMessagePromptTemplate.from_template(f"""
🎯 OBJETIVO DEL PACIENTE:
{objetivo}

📄 RESUMEN CLÍNICO:
{resumen_clinico}

🥦 ANÁLISIS DE ALIMENTOS:
{alimentos}

🔁 LISTA DE INTERCAMBIOS:
{intercambios}
""")

    messages = ChatPromptTemplate.from_messages([
        system_prompt,
        human_prompt
    ]).format_messages()

    print("🧠 Generando plan semanal detallado con porciones e intercambios...")
    respuesta = chat.invoke(messages)

    if not respuesta or not hasattr(respuesta, "content") or not respuesta.content.strip():
        raise ValueError("La respuesta del agente planificador es vacía.")

    return respuesta.content



# ✅ Agente 5: Evaluador del plan generado
def evaluar_plan_nutricional(plan_generado: str, resumen_clinico: str, objetivo: str) -> str:
    system_prompt = SystemMessagePromptTemplate.from_template("""
Eres un nutricionista clínico evaluador. Te han entregado un plan nutricional personalizado para un paciente, junto con su perfil clínico y objetivo nutricional.

Tu tarea es evaluar si el plan:

✅ Cumple con el objetivo (pérdida de peso, ganancia muscular, control glicémico, etc.)  
✅ Está alineado con las condiciones clínicas (colesterol, hipertensión, intolerancias, etc.)  
✅ Usa alimentos adecuados y equilibrados  
✅ Incluye una buena distribución de tiempos de comida y porciones razonables  

🎯 Da una evaluación crítica y profesional (no repitas el plan), señalando fortalezas y sugerencias de mejora si aplica. Finaliza con un **veredicto**:  
- "El plan es adecuado y cumple con el objetivo."  
- "El plan necesita ajustes por...".
""")

    human_prompt = HumanMessagePromptTemplate.from_template(f"""
📄 PLAN NUTRICIONAL GENERADO:
{plan_generado}

🧑‍⚕️ RESUMEN CLÍNICO DEL PACIENTE:
{resumen_clinico}

🎯 OBJETIVO NUTRICIONAL:
{objetivo}
""")

    messages = ChatPromptTemplate.from_messages([
        system_prompt,
        human_prompt
    ]).format_messages()

    print("🔍 Evaluando el plan nutricional generado...")
    respuesta = chat.invoke(messages)

    if not respuesta or not hasattr(respuesta, "content") or not respuesta.content.strip():
        raise ValueError("La respuesta del evaluador es vacía.")

    return respuesta.content


# 🧾 Agente 6: correguidor de plan
def corregir_plan_nutricional(plan: str, evaluacion: str, objetivo: str) -> str:
    system_prompt = SystemMessagePromptTemplate.from_template("""
Eres un nutricionista clínico experto en corrección de planes nutricionales.

Te han entregado un plan de alimentación y una evaluación con observaciones. Tu tarea es **modificar y corregir** el plan para que:

✅ Cumpla con el objetivo del paciente  
✅ Solucione los puntos señalados en la evaluación  
✅ Mantenga claridad, 5 tiempos de comida diarios para la semana, porciones específicas y alimentos disponibles  

No ignores los comentarios de la evaluación. Corrige el plan de forma realista y completa.
""")

    human_prompt = HumanMessagePromptTemplate.from_template(f"""
📄 PLAN ORIGINAL:
{plan}

🧪 EVALUACIÓN DEL PLAN:
{evaluacion}

🎯 OBJETIVO:
{objetivo}
""")

    messages = ChatPromptTemplate.from_messages([
        system_prompt,
        human_prompt
    ]).format_messages()

    print("🛠️ Corrigiendo el plan según la evaluación...")
    respuesta = chat.invoke(messages)

    if not respuesta or not hasattr(respuesta, "content") or not respuesta.content.strip():
        raise ValueError("La respuesta del agente corregidor es vacía.")

    return respuesta.content


# 🤖 Orquestador general
def generar_plan_multiagente(paciente_id: int, objetivo: str) -> dict:
    resumen_clinico = analizar_datos_clinicos(paciente_id)
    alimentos = analizar_alimentos_disponibles(objetivo)
    intercambios = analizar_lista_intercambios()

    intentos = 0
    max_intentos = 3

    while intentos < max_intentos:
        intentos += 1
        print(f"🔁 Intento {intentos} de generación del plan...")
        plan = generar_plan_nutricional(resumen_clinico, alimentos, objetivo, intercambios)
        evaluacion = evaluar_plan_nutricional(plan, resumen_clinico, objetivo)

        if "El plan es adecuado" in evaluacion or "aprobado" in evaluacion.lower():
            return {
                "plan_simplificado": plan,
                "evaluacion": evaluacion
            }

    print("⚠️ Invocando corrector...")
    plan_corregido = corregir_plan_nutricional(plan, evaluacion, objetivo)
    evaluacion_final = evaluar_plan_nutricional(plan_corregido, resumen_clinico, objetivo)

    if "El plan es adecuado" in evaluacion_final or "aprobado" in evaluacion_final.lower():
        return {
            "plan_simplificado": plan_corregido,
            "evaluacion": evaluacion_final
        }

    raise RuntimeError("No se logró generar un plan adecuado.")

