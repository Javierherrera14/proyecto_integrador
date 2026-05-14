# Sistema Nutricional Inteligente 🍎

![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-yellow)
![React](https://img.shields.io/badge/Frontend-React_+-TypeScript-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![AI](https://img.shields.io/badge/AI-Google_Gemini_API-orange)

Plataforma clínica integral para nutricionistas que automatiza la recopilación de datos de pacientes, evaluaciones antropométricas y utiliza inteligencia artificial para la generación de planes nutricionales personalizados.

## Estado del Proyecto
Actualmente en desarrollo activo. Frontend clínico modernizado y sistema IA funcional en entorno local.

---

## Características Principales
- **Gestión Clínica Avanzada:** Expedientes completos y cálculos automáticos (IMC, Riesgos).
- **Asistente Nutricional con IA:** Generación automática de planes dietéticos basados en el objetivo del paciente y su historial clínico.
- **Exportación Profesional:** Generación de planes en formato PDF listos para entregar al paciente.
- **Interfaz Moderna:** Diseño responsivo, estética médica y experiencia de usuario intuitiva.

## Módulos Clínicos
El sistema incorpora múltiples herramientas de evaluación estandarizadas:
- Historia clínica nutricional
- Herramienta MUST
- Exámenes bioquímicos
- Frecuencia de consumo alimentario
- Recordatorio de 24 horas (R24)
- Datos alimentarios
- Circunstancias ambientales
- Antecedentes patológicos

## Inteligencia Artificial Integrada
- Generación de planes nutricionales personalizados.
- Regeneración de planes directamente desde el expediente clínico.
- Integración avanzada con Google Gemini API + LangChain Orchestration.
- Manejo seguro de errores y límites de cuotas de IA.
- Exportación en formato PDF del plan generado y sus recomendaciones.

---

## Arquitectura y Stack Tecnológico

### Frontend
- React + TypeScript
- Vite
- Bootstrap 5
- Lucide React
- `react-markdown` y `html2pdf.js`

### Backend
- Python + FastAPI
- PostgreSQL + SQLAlchemy (ORM)
- Alembic (Migraciones)
- LangChain Orchestration + Google Gemini API

---

## Estructura del Proyecto

```text
├── frontend/         # Código fuente de la aplicación React (Vite)
├── app/              # (Backend) Código fuente de FastAPI, rutas y servicios
├── alembic/          # Migraciones de base de datos
├── docs/             # Documentación del proyecto
└── main.py           # Punto de entrada principal del backend
```

---

## Guía de Instalación Rápida

### Requisitos Previos
- Node.js (v18+)
- Python 3.9+
- PostgreSQL

### Configuración del Backend
1. Clonar el repositorio y acceder a la carpeta raíz.
2. Crear un entorno virtual e instalar las dependencias:
   ```bash
   python -m venv venv
   # Activar el entorno virtual (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)
   pip install -r requirements.txt
   ```
3. Configurar las variables de entorno en un archivo `.env` en la raíz (ver sección de Variables de Entorno).
4. Ejecutar las migraciones de la base de datos:
   ```bash
   alembic upgrade head
   ```
5. Iniciar el servidor local:
   ```bash
   uvicorn main:app --reload
   ```

### Configuración del Frontend
1. Acceder a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## Variables de Entorno (`.env`)
Debes crear un archivo `.env` en la raíz del proyecto con al menos las siguientes variables:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/db_nutricion
GOOGLE_API_KEY=tu_clave_de_gemini
GEMINI_MODEL=gemini-1.5-flash
```

---

## 📸 Capturas del Sistema

### 🔐 Inicio de Sesión
![Login](screenshots/login.jpeg)

*Pantalla moderna de autenticación para administradores y nutricionistas.*

---

### 👥 Dashboard de Pacientes
![Dashboard de Pacientes](screenshots/lista_pacientes.jpeg)

*Vista principal del directorio clínico de pacientes con accesos rápidos y métricas visuales.*

---

### 🩺 Perfil Clínico del Paciente
![Perfil del Paciente](screenshots/paciente_ver.jpeg)

*Dashboard individual del paciente con métricas antropométricas, accesos clínicos y visualización del plan nutricional.*

---

### 📋 Herramienta MUST
![Herramienta MUST](screenshots/herramienta_must.jpeg)

*Evaluación del riesgo nutricional mediante la herramienta MUST modernizada visualmente.*

---

### 🧪 Exámenes Bioquímicos
![Exámenes Bioquímicos](screenshots/examenes_bioquimicos.jpeg)

*Registro y visualización de indicadores bioquímicos relevantes para el análisis nutricional.*

---

### 🍽️ Datos Alimentarios
![Datos Alimentarios](screenshots/datos_alimentarios.jpeg)

*Formulario clínico para hábitos alimentarios, intolerancias y preferencias nutricionales.*

---

### 📝 Frecuencia de Consumo
![Frecuencia de Consumo](screenshots/frecuencia_consumo_alimentos.jpeg)

*Gestión dinámica de alimentos consumidos y clasificación de frecuencia alimentaria.*

---

### 📖 Recordatorio de 24 Horas (R24)
![R24](screenshots/R24.jpeg)

*Registro detallado del consumo alimentario diario del paciente.*

---

### 🧬 Antecedentes Patológicos
![Antecedentes Patológicos](screenshots/antecedentes_patologicos.jpeg)

*Gestión clínica de antecedentes personales y familiares relevantes.*

---

### 🌎 Circunstancias Ambientales
![Circunstancias Ambientales](screenshots/circunstancias_ambientales.jpeg)

*Evaluación de factores sociales y ambientales que afectan el estado nutricional.*

---

### 📄 Plan Nutricional Generado con IA
![Plan Nutricional](screenshots/plan_generado.jpeg)

*Visualización y regeneración de planes alimentarios personalizados utilizando Google Gemini + LangChain.*
---

## Roles de Usuario
El sistema cuenta con gestión de accesos basada en los siguientes roles:
- **Administrador:** Gestión de usuarios y acceso completo al sistema.
- **Nutricionista:** Gestión clínica y generación de planes nutricionales.

---

## Mejoras Futuras (Roadmap)
- Persistencia de planes nutricionales en base de datos.
- Historial evolutivo de planes generados por paciente.
- Integración multiagente avanzada para evaluaciones cruzadas.
- Dashboard analítico y estadístico para nutricionistas.
- Soporte para múltiples modelos IA (LLMs intercambiables).

---

## Autor
**[JAVIER HERRERA  / UNIPAMPLONA ]**
- [www.linkedin.com/in/javier-humberto-herrera-naranjo-bab327225](#)
- [GitHub](#)
- Licencia: MIT
