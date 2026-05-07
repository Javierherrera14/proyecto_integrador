import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import (
    Paciente, Herramienta_Must, Frecuencia_Consumo_Alimentos,
    Antecedentes_Patologicos, Circunstancias_Ambientales,
    Examen_Fisico, Examenes_Bioquimicos, Datos_Alimentarios
)
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

load_dotenv()
chat = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=os.getenv("GOOGLE_API_KEY"))

def generar_plan_nutricional_con_gemini(paciente_id: int, objetivo: str) -> str:
    db: Session = SessionLocal()

    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    must = db.query(Herramienta_Must).filter(Herramienta_Must.id_paciente == paciente_id).first() or Herramienta_Must()
    antecedentes = db.query(Antecedentes_Patologicos).filter(Antecedentes_Patologicos.id_paciente == paciente_id).first() or Antecedentes_Patologicos()
    frecuencia = db.query(Frecuencia_Consumo_Alimentos).filter(Frecuencia_Consumo_Alimentos.id_paciente == paciente_id).all()
    circunstancia = db.query(Circunstancias_Ambientales).filter(Circunstancias_Ambientales.id_paciente == paciente_id).first() or Circunstancias_Ambientales()
    examen_fisico = db.query(Examen_Fisico).filter(Examen_Fisico.id_paciente == paciente_id).first() or Examen_Fisico()
    bioquimico = db.query(Examenes_Bioquimicos).filter(Examenes_Bioquimicos.id_paciente == paciente_id).first() or Examenes_Bioquimicos()
    datos_alimentarios = db.query(Datos_Alimentarios).filter(Datos_Alimentarios.paciente_id == paciente_id).first() or Datos_Alimentarios()

    if not paciente:
        return "Paciente no encontrado."

    alimentos_consumidos = [
        f"- {f.alimento or 'Alimento desconocido'} ({f.grupo_alimentos or 'Grupo desconocido'})" for f in frecuencia if f.consume_si
    ]
    lista_alimentos = "\n".join(alimentos_consumidos) or "No reportado"

    def safe(attr):
        return attr if attr not in [None, ""] else "No reportado"

    # SYSTEM (guía estructural incluida aquí)
    system_template = SystemMessagePromptTemplate.from_template(f"""
Eres un nutricionista clínico experto en planificación alimentaria. Tu tarea es generar planes alimenticios personalizados,
organizados por semana (7 días), considerando datos clínicos, bioquímicos, contexto socioeconómico y preferencias personales del paciente.

📌 El plan debe tener esta estructura de ejemplo:

📝 Introducción personalizada al paciente con su nombre y objetivo  
📅 Plan semanal (Día 1 al Día 7) con 5 tiempos de comida por día:  
- Desayuno  
- Media mañana  
- Almuerzo  
- Media tarde  
- Cena  

Ejemplo de formato deseado:

---
**Día 1**  
🍽️ **Desayuno:**  
- 1 taza de leche descremada  
- 1/2 taza de avena cocida  
- 1/2 banano en rodajas  
- 1 cucharadita de semillas de chía  

🥤 **Media Mañana:**  
- 1 manzana mediana  
- 10 almendras  

🥗 **Almuerzo:**  
- 120 g de pechuga de pollo a la plancha  
- 1 taza de arroz integral  
- 1 taza de brócoli al vapor  
- 1 cucharadita de aceite de oliva  

🍎 **Media Tarde:**  
- 1 yogur natural descremado  

🌙 **Cena:**  
- 150 g de salmón al horno  
- Ensalada mixta con vinagreta  

✅ **Recomendaciones Finales:**  
- Mantente bien hidratado: al menos 6 a 8 vasos de agua al día.  
- Intenta mantener horarios regulares para cada comida.  
- Come con tranquilidad y disfruta tus alimentos.  

🙏 **Cierre:**  
Gracias por confiar en mí. Espero que este plan te sea de gran ayuda.  
""")

    # HUMAN (datos completos del paciente)
    human_template = HumanMessagePromptTemplate.from_template(f"""
📌 OBJETIVO DEL PACIENTE:
{safe(objetivo)}

📌 DATOS PERSONALES:
- Nombre: {safe(paciente.nombre_completo)}, Edad: {safe(paciente.edad)}, Sexo: {safe(paciente.sexo)}

📏 DATOS ANTROPOMÉTRICOS:
- Peso actual: {safe(paciente.peso_actual)} kg, Peso usual: {safe(paciente.peso_usual)} kg
- Talla: {safe(paciente.talla)} cm, IMC: {safe(paciente.ind_masa_corporal)} ({safe(paciente.clasificacion_imc)})
- Circunferencia cintura: {safe(paciente.circunferencia_cintura)} cm ({safe(paciente.clasificacion_circunferencia)})

🧪 EXÁMENES BIOQUÍMICOS:
- Hemoglobina Glicada: {safe(bioquimico.hemoglobina_glicada)} % ({safe(bioquimico.interpretacion_hemoglobina)})
- Glicemia Basal: {safe(bioquimico.glicemia_basal)} mg/dL ({safe(bioquimico.interpretacion_glicemia)})
- Colesterol Total: {safe(bioquimico.colesterol_total)} mg/dL ({safe(bioquimico.interpretacion_colesterol_total)})
- HDL: {safe(bioquimico.colesterol_hdl)} mg/dL ({safe(bioquimico.interpretacion_colesterol_hdl)})
- LDL: {safe(bioquimico.colesterol_ldl)} mg/dL ({safe(bioquimico.interpretacion_colesterol_ldl)})
- Triglicéridos: {safe(bioquimico.trigliceridos)} mg/dL ({safe(bioquimico.interpretacion_trigliceridos)})
- Creatinina: {safe(bioquimico.creatinina)} mg/dL ({safe(bioquimico.interpretacion_creatinina)})

🩺 ANTECEDENTES:
- Hipertensión personal: {safe(antecedentes.hipertension_personal)}, Diabetes familiar: {safe(antecedentes.diabetes_familiar)}
- Quirúrgicos: {safe(antecedentes.quirurgicos)}

🌿 CIRCUNSTANCIAS:
- Limitaciones económicas: {safe(circunstancia.limitaciones_economicas)}

🧍 EXAMEN FÍSICO:
- Palidez: {safe(examen_fisico.palidez)}, Glositis: {safe(examen_fisico.glositis)}

🍽️ DATOS ALIMENTARIOS:
- Intolerancias: {safe(datos_alimentarios.intolerancia_alimentos)} ({safe(datos_alimentarios.alimentos_intolerancia)})
- Problemas digestivos: {safe(datos_alimentarios.problemas_digestivos)} ({safe(datos_alimentarios.tipo_problema_digestivo)})
- Medicamentos: {safe(datos_alimentarios.lista_medicamentos)}
- Suplementos: {safe(datos_alimentarios.toma_suplementos)}
- Alimentos preferidos: {safe(datos_alimentarios.alimentos_agradan)}
- Alimentos no preferidos: {safe(datos_alimentarios.alimentos_no_agradan)}

🍴 ALIMENTOS CONSUMIDOS FRECUENTEMENTE:
{lista_alimentos}
""")

    try:
        messages = ChatPromptTemplate.from_messages([
            system_template,
            human_template
        ]).format_messages()

        print("✅ Prompt generado:")
        for m in messages:
            print(m.content)

        respuesta = chat.invoke(messages)
        print("✅ Respuesta recibida:")
        print(respuesta)

        if not respuesta or not hasattr(respuesta, "content") or not respuesta.content.strip():
            raise ValueError("La respuesta de Gemini no contiene contenido válido.")
        return respuesta.content

    except Exception as e:
        print(f"❌ Error al invocar Gemini: {e}")
        raise RuntimeError(f"Error interno al generar el plan: {e}")
