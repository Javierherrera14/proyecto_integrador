Documento de Arquitectura de Software
Sistema Nutricional Inteligente
Tipo de documento: visión, alcance, requerimientos, diseño, documentación y evaluación arquitectónica
Proyecto: Sistema Nutricional Inteligente / NutriSystem
Repositorio analizado: PROYECTO_SI
Fecha: 21 de mayo de 2026
Versión: 1.0 
Tabla de contenido
1. Introducción
1.1 Propósito del documento
1.2 Alcance documental
1.3 Fuentes de información
2. Documento de visión y alcance
2.1 Contexto de negocio
2.2 Antecedentes
2.3 Formulación del problema
2.4 Objetivos de negocio
2.5 Visión de la solución
2.6 Características del sistema
2.7 Alcance
2.8 Interesados
2.9 Contexto del sistema
2.10 Entorno de operación
3. Requerimientos de arquitectura
3.1 Drivers funcionales
3.2 Casos de uso arquitectónicamente significativos
3.3 Atributos de calidad
3.4 Restricciones
4. Diseño arquitectónico
4.1 Estilo arquitectónico general
4.2 Diseño por iteraciones
4.3 Decisiones arquitectónicas
5. Documentación de la arquitectura
5.1 Vista de contexto
5.2 Vista de contenedores
5.3 Vista de módulos backend
5.4 Vista de frontend
5.5 Vista de datos
5.6 Vista de comportamiento
5.7 Interfaces principales
6. Evaluación de la arquitectura
6.1 Método de evaluación
6.2 Árbol de utilidad
6.3 Análisis de escenarios
7. Riesgos y no-riesgos
8. Conclusiones
9. Referencias internas revisadas
1. Introducción
1.1 Propósito del documento
El presente documento describe la arquitectura del Sistema Nutricional Inteligente, una aplicación web orientada a la gestión clínica nutricional de pacientes y a la generación asistida de planes alimentarios mediante inteligencia artificial. Su propósito es registrar, de manera académica y técnica, los elementos que explican la estructura del sistema, las decisiones adoptadas, los drivers que influyen en dichas decisiones y los riesgos asociados a la arquitectura actual.
El documento se elabora como caso de estudio de arquitectura de software. Por ello, no se limita a enumerar tecnologías, sino que organiza la información en términos de visión, alcance, requerimientos arquitectónicos, diseño por iteraciones, vistas, interfaces, evaluación, riesgos y conclusiones.
1.2 Alcance documental
Este documento describe el estado real observado en el proyecto actual. No modifica código fuente, configuración, endpoints, archivos de frontend, archivos de backend, dependencias, migraciones, base de datos ni variables de entorno. La documentación se construye únicamente a partir de lectura del repositorio y de los documentos de referencia.
El alcance incluye:
•	Caracterización del negocio y del problema.
•	Identificación de objetivos de negocio, características y casos de uso.
•	Análisis de atributos de calidad y restricciones.
•	Descripción de la arquitectura con vistas y diagramas.
•	Evaluación inspirada en ATAM.
•	Identificación de riesgos, no-riesgos y mejoras futuras.
El alcance no incluye:
•	Cambios en React, TypeScript, FastAPI, PostgreSQL, SQLAlchemy, Alembic o LangChain.
•	Creación o modificación de endpoints.
•	Ajustes de estilos, componentes, modelos o migraciones.
•	Suposición de funcionalidades no implementadas.
1.3 Fuentes de información
Las fuentes revisadas para la elaboración de esta versión formal fueron:
Fuente	Uso en el documento
docs/documento-arquitectura.md	Base técnica inicial de la arquitectura documentada.
README.md	Contexto general del proyecto, stack tecnológico, módulos y roadmap.
main.py	Punto de entrada FastAPI, CORS y routers montados realmente.
app/database.py	Configuración de conexión, sesión y base declarativa SQLAlchemy.
app/models/models.py	Modelo relacional y entidades clínicas.
app/routers/	Endpoints REST disponibles o presentes en el repositorio.
app/service/	Servicios de generación de planes e integración IA.
app/schemas/	Contratos Pydantic principales.
frontend/src/	Rutas, pantallas, servicios HTTP, tipos y componentes React.
frontend/package.json y requirements.txt	Dependencias reales de frontend y backend.

2. Documento de visión y alcance
2.1 Contexto de negocio
El dominio funcional del sistema corresponde a la atención nutricional clínica. En este entorno, el profesional de nutrición requiere registrar datos de pacientes, consultar antecedentes, almacenar evaluaciones, revisar indicadores antropométricos y bioquímicos, y construir planes alimentarios que respondan a objetivos específicos.
El Sistema Nutricional Inteligente aporta valor al centralizar la información clínica nutricional en una plataforma web. La aplicación facilita que el nutricionista trabaje con expedientes digitales, formularios especializados y generación asistida de planes. La generación con IA no reemplaza la revisión profesional; funciona como soporte para acelerar la construcción de una propuesta alimentaria inicial.
2.2 Antecedentes
El repositorio presenta un sistema en desarrollo activo, compuesto por una aplicación frontend y una API backend. El frontend está implementado con React, TypeScript y Vite; el backend está construido con FastAPI; la persistencia se gestiona con PostgreSQL mediante SQLAlchemy; Alembic está configurado para migraciones; y la generación de planes nutricionales utiliza LangChain con Google Gemini API.
Los módulos funcionales observados incluyen gestión de usuarios, inicio de sesión, registro de pacientes, expediente clínico, herramienta MUST, antecedentes patológicos, circunstancias ambientales, examen físico, exámenes bioquímicos, datos alimentarios, frecuencia de consumo, recordatorio de 24 horas y generación de planes nutricionales.
También se identifican módulos presentes en el código, pero no necesariamente expuestos desde main.py, por ejemplo, algunos routers relacionados con composición de alimentos, minerales, vitaminas, análisis proximal, ácidos grasos, análisis bioquímico R24, lista de intercambios y detalle de R24. En este documento se tratan como funcionalidad parcial o mejora futura cuando no están montados en la aplicación principal.
2.3 Formulación del problema
El problema central consiste en la dispersión y carga operativa asociada a la gestión clínica nutricional. Un nutricionista necesita consolidar datos personales, mediciones, antecedentes, hábitos, exámenes y objetivos antes de diseñar un plan alimentario. Si esta información se administra manualmente o en herramientas aisladas, se incrementa el tiempo de atención, se pierde trazabilidad y se dificulta reutilizar datos clínicos para apoyar decisiones.
El sistema busca resolver esta situación mediante:
•	Expedientes digitales asociados a usuarios del sistema.
•	Formularios clínicos relacionados con el paciente.
•	Consulta de métricas y evaluaciones relevantes.
•	Generación asistida de planes nutricionales.
•	Visualización del plan y exportación a PDF.
Las brechas actuales no deben confundirse con funcionalidades implementadas. Se observaron autenticación básica sin token, contraseñas comparadas en texto plano, almacenamiento temporal del plan generado en localStorage, URLs de API definidas directamente en servicios del frontend y ausencia de versiones Alembic en alembic/versions. Estas condiciones se registran como riesgos y mejoras futuras.
2.4 Objetivos de negocio
ID	Objetivo de negocio	Criterio de verificación	Estado observado
ON-01	Mejorar la gestión clínica nutricional mediante expedientes digitales de pacientes.	Crear, consultar, actualizar y desactivar pacientes desde la aplicación.	Implementado en módulo de pacientes.
ON-02	Centralizar evaluaciones nutricionales y antecedentes clínicos relevantes.	Acceder desde el expediente a formularios clínicos asociados al paciente.	Implementado en rutas y pantallas principales.
ON-03	Reducir el tiempo de elaboración inicial de planes alimentarios.	Generar una propuesta de plan a partir de objetivo y datos clínicos.	Implementado mediante /plan/ y Gemini.
ON-04	Facilitar la entrega profesional del plan al paciente.	Visualizar el plan y exportarlo a PDF desde el frontend.	Implementado con react-markdown y html2pdf.js.
ON-05	Diferenciar responsabilidades básicas entre administrador y nutricionista.	Mostrar gestión de usuarios al rol admin.	Implementado en navegación frontend; autorización backend es mejora futura.

2.5 Visión de la solución
La solución propuesta es una aplicación web clínica que permite a nutricionistas gestionar pacientes, completar formularios de evaluación y generar planes alimentarios con apoyo de inteligencia artificial. El usuario accede desde un navegador, inicia sesión, consulta su directorio de pacientes, ingresa al expediente de un paciente y registra información clínica relevante.
Cuando se solicita un plan nutricional, el backend consulta la base de datos, construye un resumen clínico, obtiene referencias alimentarias internas y utiliza LangChain para invocar Google Gemini API. La respuesta se devuelve al frontend, donde se muestra como Markdown y puede exportarse a PDF.
La arquitectura real observada corresponde a un sistema web cliente-servidor, con una separación clara entre interfaz, API, dominio, persistencia e integración externa.
2.6 Características del sistema
ID	Característica	Prioridad	Objetivo asociado	Observación
CAR-01	Autenticación básica por correo y contraseña.	Alta	ON-05	Existe, pero requiere fortalecimiento de seguridad.
CAR-02	Registro y mantenimiento de usuarios con rol.	Media	ON-05	Roles admin y nutricionista.
CAR-03	Gestión de pacientes asociados a usuario.	Alta	ON-01	Incluye creación, edición, listado y eliminación lógica/permanente.
CAR-04	Expediente clínico del paciente.	Alta	ON-01, ON-02	Agrupa métricas y accesos a formularios.
CAR-05	Registro de herramienta MUST.	Alta	ON-02	Implementado como formulario y router.
CAR-06	Registro de frecuencia de consumo alimentario.	Alta	ON-02	Datos usados por el servicio de plan.
CAR-07	Registro de antecedentes patológicos.	Alta	ON-02	Asociado al paciente.
CAR-08	Registro de circunstancias ambientales.	Media	ON-02	Asociado al paciente.
CAR-09	Registro de examen físico.	Media	ON-02	Asociado al paciente.
CAR-10	Registro de exámenes bioquímicos.	Alta	ON-02	Incluye valores e interpretaciones.
CAR-11	Registro de datos alimentarios.	Alta	ON-02	Incluye preferencias, intolerancias y medicamentos.
CAR-12	Registro de recordatorio de 24 horas.	Media	ON-02	Router principal montado; detalle requiere revisión de integración.
CAR-13	Generación de plan nutricional con LangChain y Gemini.	Alta	ON-03	Implementado en servicio backend.
CAR-14	Visualización Markdown y exportación a PDF.	Media	ON-04	Implementado en vista de paciente.
CAR-15	Historial persistente de planes generados.	Baja	ON-03, ON-04	No implementado en backend; mejora futura.

2.7 Alcance
2.7.1 Alcance incluido
Entrega	Tema	Características incluidas	Estado
1.0	Base operativa	CAR-01, CAR-02, CAR-03	Implementado de forma básica.
1.1	Expediente clínico	CAR-04, CAR-05, CAR-06, CAR-07, CAR-08, CAR-09, CAR-10, CAR-11, CAR-12	Implementado en pantallas y routers principales.
1.2	Plan nutricional asistido por IA	CAR-13, CAR-14	Implementado con LangChain, Gemini, Markdown y PDF.

2.7.2 Exclusiones y mejoras futuras
ID	Exclusión o mejora futura	Justificación
MF-01	Autenticación con JWT, sesiones o refresh tokens.	No se observa implementación actual.
MF-02	Hash seguro de contraseñas.	El login compara contraseña directamente.
MF-03	Autorización backend por rol y propiedad del recurso.	El rol se usa principalmente en frontend.
MF-04	Historial persistente de planes.	El plan se conserva en localStorage, no en tabla dedicada.
MF-05	Dashboard analítico y estadístico.	Mencionado como roadmap, no implementado.
MF-06	Montaje completo de routers no incluidos en main.py.	Existen archivos backend no expuestos por la app principal.
MF-07	Externalización de URL base del API en frontend.	Actualmente se observan URLs locales directas.

2.8 Interesados
Interesado	Descripción	Responsabilidades
Nutricionista	Usuario clínico principal.	Registrar pacientes, diligenciar formularios, generar planes y revisar resultados.
Administrador	Usuario con acceso a gestión de usuarios desde la navegación.	Crear, consultar, actualizar o eliminar usuarios del sistema.
Paciente	Beneficiario de la atención nutricional.	Proporcionar información clínica y recibir el plan alimentario.
Equipo de desarrollo	Responsable de mantener frontend, backend, persistencia e IA.	Evolucionar arquitectura, corregir riesgos y sostener calidad técnica.
Google Gemini API	Servicio externo de generación de texto.	Responder solicitudes de generación de planes alimentarios.
PostgreSQL	Sistema gestor de base de datos.	Persistir usuarios, pacientes y registros clínicos.

2.9 Contexto del sistema
El sistema se comunica con usuarios humanos mediante navegador web, con PostgreSQL para persistencia y con Google Gemini API para generación de planes. La API FastAPI actúa como frontera entre el frontend, el modelo de datos y los servicios externos.
Figura 1. 
 
2.10 Entorno de operación
Elemento	Tecnología o condición observada
Cliente web	Navegador con SPA React.
Frontend	React, TypeScript, Vite, React Router, Bootstrap, Lucide, react-markdown, html2pdf.js.
Backend	FastAPI, Uvicorn, Pydantic, routers por módulo.
Persistencia	PostgreSQL.
ORM	SQLAlchemy.
Migraciones	Alembic configurado; sin versiones en alembic/versions al momento de revisión.
IA	LangChain Core, LangChain Google GenAI, Google Gemini API.
Configuración	. env con DATABASE_URL, GOOGLE_API_KEY y GEMINI_MODEL.
CORS	Permitido para localhost:5173 y 127.0.0.1:5173.

3. Requerimientos de arquitectura
3.1 Drivers funcionales
ID	Driver funcional	Actor	Características relacionadas	Razón arquitectónica
DF-01	Inicio de sesión y conservación de usuario en cliente.	Usuario del sistema	CAR-01	Define el acceso inicial y el uso de localStorage.
DF-02	Gestión de pacientes por usuario.	Nutricionista	CAR-03	Conecta frontend, API, ORM y base de datos.
DF-03	Consulta del expediente clínico.	Nutricionista	CAR-04	Organiza la navegación hacia módulos clínicos.
DF-04	Registro de evaluaciones clínicas.	Nutricionista	CAR-05 a CAR-12	Requiere consistencia entre formularios, rutas y tablas.
DF-05	Generación de plan nutricional con IA.	Nutricionista	CAR-13	Integra datos clínicos, servicio backend, LangChain y Gemini.
DF-06	Visualización y exportación del plan.	Nutricionista	CAR-14	Requiere representación Markdown y generación PDF en navegador.

3.2 Casos de uso arquitectónicamente significativos
3.2.1 Catálogo de casos de uso
 
ID	Caso de uso	Actor principal	Descripción	Prioridad
CU-01	Iniciar sesión	Nutricionista / Administrador	Validar credenciales y guardar datos básicos del usuario en cliente.	Alta
CU-02	Registrar usuario	Administrador /Nutricionista	Crear usuario con nombre, correo, contraseña y rol.	Media
CU-03	Gestionar pacientes	Nutricionista	Crear, listar, editar, desactivar o eliminar pacientes.	Alta
CU-04	Consultar expediente del paciente	Nutricionista	Visualizar métricas y accesos a formularios clínicos.	Alta
CU-05	Registrar evaluación MUST	Nutricionista	Almacenar puntajes, clasificación y recomendaciones MUST.	Alta
CU-06	Registrar frecuencia de consumo	Nutricionista	Registrar grupos, alimentos y frecuencia de consumo.	Alta
CU-07	Registrar antecedentes patológicos	Nutricionista	Registrar antecedentes personales, familiares y quirúrgicos.	Alta
CU-08	Registrar circunstancias ambientales	Nutricionista	Registrar factores sociales o ambientales relevantes.	Media
CU-09	Registrar exámenes físico y bioquímico	Nutricionista	Registrar señales físicas e indicadores bioquímicos.	Alta
CU-10	Registrar datos alimentarios y R24	Nutricionista	Registrar hábitos, preferencias y recordatorio alimentario.	Alta
CU-11	Generar plan nutricional con IA	Nutricionista	Solicitar plan con objetivo y datos clínicos disponibles.	Alta
CU-12	Exportar plan nutricional a PDF	Nutricionista	Convertir el plan visualizado en documento PDF.	Media

3.2.2 Especificación resumida de casos primarios
Campo	CU-03: Gestionar pacientes
Actor	Nutricionista
Precondición	Usuario registrado e identificado en el cliente.
Flujo principal	El usuario ingresa al directorio, consulta pacientes asociados, crea o edita registros y puede desactivar o eliminar.
Componentes	PacienteListPage, PacienteFormPage, pacienteService.ts, router /pacientes, modelo Paciente.
Postcondición	El registro queda persistido o actualizado en PostgreSQL.
Excepciones	Paciente no encontrado, error de base de datos, usuario sin ID en cliente.

Campo	CU-04: Consultar expediente del paciente
Actor	Nutricionista
Precondición	Paciente existente y accesible desde el directorio.
Flujo principal	El usuario abre el expediente, observa métricas base y navega a formularios clínicos.
Componentes	PacienteVerPage, componentes de formularios, servicios HTTP.
Postcondición	El usuario cuenta con vista integral para continuar registro clínico o generar plan.
Excepciones	Paciente no encontrado o datos incompletos.

Campo	CU-11: Generar plan nutricional con IA
Actor	Nutricionista
Precondición	Paciente existente, objetivo definido, API activa y GOOGLE_API_KEY configurada.
Flujo principal	El frontend envía paciente_id y objetivo; el backend consulta datos clínicos, construye prompts y llama a Gemini.
Componentes	planAlimentacionService.ts, router /plan, multiagent_plan_service.py, SQLAlchemy, LangChain, Gemini.
Postcondición	Se retorna plan_simplificado y evaluación al frontend.
Excepciones	Paciente no encontrado, cuota Gemini excedida, error de configuración o servicio externo no disponible.

3.3 Atributos de calidad
ID	Atributo	Escenario	Prioridad	Evidencia o estado
EAC-01	Mantenibilidad	Agregar un formulario clínico debe poder seguir el patrón página, servicio, router, esquema y modelo.	Alta	Estructura modular observada en frontend y backend.
EAC-02	Modificabilidad	Cambiar el modelo Gemini debe realizarse por configuración sin alterar frontend.	Media	GEMINI_MODEL se lee desde. env.
EAC-03	Seguridad	Las credenciales y datos clínicos deben protegerse contra acceso no autorizado.	Alta	Existe brecha por autenticación básica sin hash ni token.
EAC-04	Disponibilidad	Si Gemini falla, el sistema debe informar el problema sin corromper datos.	Alta	Manejo de error en frontend y backend; requiere robustecimiento.
EAC-05	Usabilidad	El nutricionista debe navegar desde expediente hacia formularios relevantes.	Alta	PacienteVerPage ofrece accesos clínicos.
EAC-06	Interoperabilidad	Frontend y backend deben intercambiar JSON consistente.	Alta	Existen servicios y esquemas, pero hay desalineaciones por revisar.
EAC-07	Persistencia	Los registros clínicos deben conservar integridad referencial hacia paciente.	Alta	Modelos SQLAlchemy con claves foráneas y relaciones.
EAC-08	Observabilidad 	Los errores deben diagnosticarse sin exponer datos sensibles.	Media	Hay uso de print; logging estructurado es mejora futura.

3.4 Restricciones
ID	Restricción	Origen	Impacto
RES-01	Uso de React + TypeScript + Vite.	Proyecto existente	Define aplicación SPA y rutas de cliente.
RES-02	Uso de FastAPI.	Proyecto existente	Define API REST, routers y Pydantic.
RES-03	Uso de PostgreSQL.	Proyecto existente	Define persistencia relacional.
RES-04	Uso de SQLAlchemy.	Proyecto existente	Define ORM, entidades y sesiones.
RES-05	Uso de Alembic.	Proyecto existente	Define mecanismo esperado de migraciones.
RES-06	Uso de LangChain y Google Gemini API.	Proyecto existente	Introduce dependencia externa para generación de planes.
RES-07	Configuración mediante. env.	Proyecto existente	Centraliza URL de DB, clave Gemini y modelo.
RES-08	Documentar sin modificar código.	Condición del trabajo	La arquitectura se analiza sin alterar implementación.

4. Diseño arquitectónico
4.1 Estilo arquitectónico general
La arquitectura corresponde a una aplicación web cliente-servidor con separación en capas. El frontend implementa la interacción del usuario, el backend concentra lógica de API, validación, persistencia e integración con IA, y PostgreSQL almacena la información clínica. La comunicación entre frontend y backend se realiza mediante HTTP REST y JSON.
El diseño también incorpora una integración externa con Google Gemini API, encapsulada en servicios backend. Esta decisión evita exponer la clave de API al navegador y permite construir prompts a partir de datos clínicos persistidos.
4.2 Diseño por iteraciones
4.2.1 Iteración 1: estructura base del sistema
Aspecto	Descripción
Elemento descompuesto	Sistema completo.
Drivers	CU-01, CU-03, EAC-05, RES-01, RES-02.
Decisión	Separar SPA React, API FastAPI y base PostgreSQL.
Resultado	Arquitectura web de tres capas con comunicación HTTP JSON.
Compromiso	Simplicidad local frente a configuración menos flexible para despliegues.

4.2.2 Iteración 2: dominio clínico y persistencia
Aspecto	Descripción
Elemento descompuesto	Backend y modelo de datos.
Drivers	CU-03 a CU-10, EAC-01, EAC-07.
Decisión	Modelar entidades clínicas con SQLAlchemy y routers por módulo.
Resultado	Paciente como entidad central relacionada con formularios y evaluaciones.
Compromiso	Modelo amplio y trazable, con necesidad de homogenizar contratos y rutas.

4.2.3 Iteración 3: generación asistida por IA
Aspecto	Descripción
Elemento descompuesto	Servicio de plan nutricional.
Drivers	CU-11, EAC-02, EAC-04, RES-06.
Decisión	Orquestar consultas clínicas, prompts LangChain y llamada a Gemini desde backend.
Resultado	Plan semanal generado y devuelto al frontend como texto Markdown.
Compromiso	Mayor automatización frente a dependencia de disponibilidad, cuota y calidad del proveedor externo.

4.3 Decisiones arquitectónicas
ID	Driver relacionado	Decisión	Justificación	Consecuencia
DA-01	EAC-01	Separar frontend, routers, modelos, esquemas y servicios.	Mejora mantenibilidad por capa.	Requiere disciplina para mantener contratos consistentes.
DA-02	EAC-05	Usar expediente del paciente como centro de navegación clínica.	Reduce fricción de uso y centraliza acceso a formularios.	La vista de paciente concentra responsabilidades de experiencia.
DA-03	EAC-07	Usar SQLAlchemy con relaciones hacia Paciente.	Favorece integridad y trazabilidad clínica.	Requiere migraciones consistentes.
DA-04	EAC-02	Configurar Gemini mediante variables de entorno.	Permite cambiar modelo sin tocar interfaz.	Depende de configuración correcta del ambiente.
DA-05	EAC-04	Encapsular invocación IA en backend.	Protege clave de Gemini y centraliza manejo de errores.	El backend asume latencia y fallas del proveedor.
DA-06	EAC-06	Usar Pydantic y TypeScript para contratos.	Aporta validación y tipado.	Se deben alinear tipos de frontend con respuestas reales.

5. Documentación de la arquitectura
5.1 Vista de contexto
Figura 2. 
 
5.2 Vista de contenedores
Figura 3. 
 
5.2.1 Catálogo de contenedores
Contenedor	Responsabilidad	Tecnología
Frontend SPA	Gestionar navegación, formularios, visualización y exportación PDF.	React, TypeScript, Vite, Bootstrap.
API FastAPI	Exponer endpoints, validar solicitudes y coordinar servicios.	FastAPI, Pydantic.
Servicios backend	Orquestar lógica clínica e integración con Gemini.	Python, LangChain.
Modelo de datos	Representar entidades y relaciones clínicas.	SQLAlchemy.
Base de datos	Persistir usuarios, pacientes y registros clínicos.	PostgreSQL.
Servicio IA	Generar texto del plan nutricional.	Google Gemini API.

5.3 Vista de módulos backend
Módulo	Ruta o responsabilidad	Estado observado
login	POST /login	Montado en main.py.
usuarios	/usuarios	Montado en main.py.
pacientes	/pacientes	Montado en main.py.
herramienta_must	/herramienta_must	Montado en main.py.
examenes_bioquimicos	/examenes_bioquimicos	Montado en main.py.
examen_fisico	/examen_fisico	Montado en main.py.
r24	/r24	Montado en main.py.
frecuencia_consumo_alimentos	/frecuencia_consumo_alimentos	Montado en main.py.
datos_alimentarios	/datos_alimentarios	Montado en main.py.
circunstancias_ambientales	/circunstancias_ambientales	Montado en main.py.
antecedentes_patologicos	/antecedentes_patologicos	Montado en main.py.
plan_nutricional	/plan	Montado en main.py.
r24_detalle y nutrición detallada	Routers presentes en archivos.	No se observaron montados en main.py; mejora futura.

5.4 Vista de frontend
Ruta frontend	Pantalla	Responsabilidad
/	LoginForm	Inicio de sesión.
/registro	RegistroForm	Registro de usuario con rol.
/usuarios	Usuarios	Gestión de usuarios para rol administrador.
/pacientes	PacienteListPage	Directorio, búsqueda y acciones de paciente.
/pacientes/nuevo	PacienteFormPage	Creación de paciente.
/pacientes/editar/:id	PacienteFormPage	Edición de paciente.
/pacientes/ver/:id	PacienteVerPage	Expediente, métricas, formularios y plan.
/herramienta-must/:id	HerramientaMustPage	Evaluación MUST.
/frecuenciaConsumoAlimentos/:idPaciente	FrecuenciaConsumoAlimentosPage	Frecuencia alimentaria.
/antecedentesPatologicos/:idPaciente	AntecedentesPatologicosPage	Antecedentes patológicos.
/circunstancias-ambientales/:idPaciente	CircunstanciasAmbientalesPage	Circunstancias ambientales.
/examen-fisico/:idPaciente	ExamenFisicoPage	Examen físico.
/examenes-bioquimicos/:id	ExamenesBioquimicosPage	Exámenes bioquímicos.
/datos-alimentariosPage/:paciente_id	DatosAlimentariosPage	Datos alimentarios.
/r24/:idPaciente	R24Page	Recordatorio 24 horas.
/r24_detalle/:idR24	R24DetallePage	Detalle R24 en frontend; integración backend requiere revisión.

5.5 Vista de datos
Figura 4. 
 
5.6 Vista de comportamiento
5.6.1 Generación de plan nutricional
Figura 5.
 
5.7 Interfaces principales
Interfaz	Entrada	Salida	Precondición	Excepción relevante
POST /login	email, contrasena	id, nombre_completo, rol	Usuario existe.	401 por credenciales incorrectas.
POST /usuarios/	Datos de usuario	Usuario creado	Email no duplicado.	Error de base de datos.
GET /usuarios/	Sin cuerpo	Lista de usuarios	API disponible.	Error de servidor.
POST /pacientes/	Datos de paciente y usuario_id	Paciente creado	Datos obligatorios completos.	500 por error de persistencia.
GET /pacientes/?usuario_id=	usuario_id	Pacientes activos	Parámetro requerido.	Lista vacía o error de servidor.
PUT /pacientes/{id}	Datos parciales	Paciente actualizado	Paciente existe.	404 si no existe.
DELETE /pacientes/{id}	eliminar_definitivo	Mensaje	Paciente existe.	404 si no existe.
POST /herramienta_must/	Datos MUST	Evaluación creada	Paciente asociado.	Error de validación o persistencia.
POST /plan/	paciente_id, objetivo	plan_simplificado, evaluacion	Paciente existe y Gemini configurado.	Error de Gemini, cuota o configuración.

6. Evaluación de la arquitectura
6.1 Método de evaluación
La evaluación se organiza con una lógica inspirada en ATAM. Se revisan objetivos de negocio, drivers funcionales, atributos de calidad, decisiones arquitectónicas, puntos de sensibilidad y riesgos. El propósito no es certificar producción, sino identificar fortalezas y debilidades arquitectónicas con base en escenarios concretos.
Paso	Aplicación en este caso
Presentación de objetivos	Definidos en ON-01 a ON-05.
Identificación de drivers	Documentados como DF-01 a DF-06 y CU-01 a CU-12.
Presentación de arquitectura	Explicada mediante vistas de contexto, contenedores, datos y comportamiento.
Identificación de decisiones	Registradas como DA-01 a DA-06.
Construcción de árbol de utilidad	Priorización de seguridad, disponibilidad, mantenibilidad, interoperabilidad, persistencia y usabilidad.
Análisis de escenarios	Revisión de generación IA, gestión de pacientes y evolución del esquema.
Registro de riesgos	Consolidación en R1 a R8 y NR1 a NR6.

6.2 Árbol de utilidad
Atributo	Sub atributo	Escenario	Importancia	Dificultad
Seguridad	Control de acceso	Un usuario solo debería acceder a sus pacientes y funciones autorizadas.	Alta	Alta
Disponibilidad	Servicio IA externo	Si Gemini excede cuota o falla, el sistema debe informar sin perder datos.	Alta	Media
Mantenibilidad	Modularidad clínica	Agregar formularios debe seguir un patrón claro por capa.	Alta	Media
Interoperabilidad	Contratos API	Frontend y backend deben mantener rutas y campos consistentes.	Alta	Media
Persistencia	Integridad clínica	Los datos clínicos deben quedar asociados al paciente correcto.	Alta	Media
Usabilidad	Flujo del expediente	El profesional debe generar y descargar un plan sin salir del contexto clínico.	Media	Baja

6.3 Análisis de escenarios
6.3.1 Escenario E-01: generación de plan con IA
Campo	Análisis
Escenario	Generación de plan nutricional con IA para un paciente registrado.
Atributos	Disponibilidad, interoperabilidad, seguridad, mantenibilidad.
Estímulo	El nutricionista selecciona un objetivo y solicita generar plan.
Respuesta esperada	El sistema consulta datos, invoca Gemini y devuelve plan_simplificado y evaluacion.
Decisiones relacionadas	DA-04, DA-05, DA-06.
Punto de sensibilidad	Configuración de GOOGLE_API_KEY, cuota Gemini y consistencia del contrato /plan.
Equilibrio	Automatización del proceso frente a dependencia externa.
Riesgos relacionados	R1, R2, R5.
No-riesgos relacionados	NR1, NR2.

6.3.2 Escenario E-02: gestión de pacientes por nutricionista
Campo	Análisis
Escenario	Consulta, creación, edición y eliminación de pacientes.
Atributos	Seguridad, persistencia, usabilidad.
Estímulo	El usuario opera el directorio de pacientes.
Respuesta esperada	La API filtra por usuario_id y persiste cambios.
Decisiones relacionadas	DA-01, DA-02, DA-03.
Punto de sensibilidad	Confianza en el usuario_id enviado desde el cliente.
Equilibrio	Simplicidad de implementación frente a autorización robusta.
Riesgos relacionados	R3, R8.
No-riesgos relacionados	NR3, NR5.

6.3.3 Escenario E-03: evolución del modelo clínico
Campo	Análisis
Escenario	Incorporar nueva tabla o campo clínico.
Atributos	Mantenibilidad, modificabilidad, persistencia.
Estímulo	El equipo requiere ampliar formularios o datos del paciente.
Respuesta esperada	Se actualizan modelos, esquemas, rutas, servicios y migraciones.
Decisiones relacionadas	DA-01, DA-03.
Punto de sensibilidad	Uso efectivo de Alembic y consistencia entre capas.
Equilibrio	Velocidad de cambio frente a control del esquema.
Riesgos relacionados	R4, R6.
No-riesgos relacionados	NR4.

7. Riesgos y no-riesgos
7.1 Riesgos
ID	Riesgo	Causa	Impacto	Mitigación sugerida
R1	Dependencia de disponibilidad y cuota de Gemini.	El plan depende de Google Gemini API.	No se generan planes si el servicio falla.	Reintentos controlados, mensajes claros, fallback manual y registro de errores.
R2	Planes no persistidos en backend.	El resultado se guarda en localStorage.	Pérdida de historial y trazabilidad.	Crear entidad de planes nutricionales como mejora futura.
R3	Control de acceso insuficiente en backend.	Rol y usuario se manejan en cliente sin token observado.	Acceso potencial a recursos no autorizados.	Implementar JWT/sesión y autorización por recurso.
R4	Migraciones no versionadas.	alembic/versions está vacío.	Dificultad para reproducir evolución de esquema.	Generar migraciones y política de cambios DB.
R5	Inconsistencia de contratos frontend-backend.	Algunas rutas o respuestas no están plenamente alineadas.	Fallas de consumo de API o ejecución.	Validar contratos con OpenAPI y tipos compartidos.
R6	Routers existentes no montados en main.py.	Archivos backend presentes, pero no incluidos.	Funcionalidad parcial o inaccesible.	Revisar intención funcional y montar con pruebas.
R7	URLs de API hard-coded en frontend.	Servicios usan localhost o 127.0.0.1.	Dificulta despliegues fuera del entorno local.	Usar variables de entorno de Vite.
R8	Contraseñas en texto plano.	El login compara contraseña directamente.	Riesgo crítico si la base se expone.	Aplicar hashing seguro y política de credenciales.

7.2 No-riesgos
ID	No-riesgo	Justificación
NR1	La clave de Gemini no se expone al navegador.	La invocación ocurre desde backend.
NR2	La generación IA está encapsulada en un servicio.	multiagent_plan_service.py concentra la orquestación.
NR3	El modelo relacional se centra en Paciente.	Favorece trazabilidad clínica y asociación de formularios.
NR4	Alembic está configurado con Base.metadata.	La infraestructura base de migración existe.
NR5	El expediente agrupa accesos clínicos relevantes.	Mejora la experiencia del nutricionista.
NR6	La exportación PDF se resuelve en frontend.	html2pdf.js permite generar entregables sin carga backend.

8. Conclusiones
El Sistema Nutricional Inteligente presenta una arquitectura coherente para una plataforma clínica en desarrollo. La separación entre frontend React + TypeScript + Vite, API FastAPI, persistencia PostgreSQL con SQLAlchemy, migraciones Alembic e integración LangChain + Google Gemini API permite organizar el sistema en capas comprensibles y mantenibles.
Los principales drivers arquitectónicos son la gestión de pacientes, la centralización de evaluaciones clínicas y la generación de planes alimentarios asistida por IA. La decisión de ejecutar la integración con Gemini desde backend es adecuada porque protege la clave del proveedor y permite construir prompts a partir de datos persistidos. Del mismo modo, el expediente del paciente como centro de navegación favorece la usabilidad del profesional.
La evaluación evidencia riesgos que deben tratarse antes de un escenario de producción: autenticación y autorización robustas, hash de contraseñas, persistencia histórica de planes, versiona miento de migraciones, alineación de contratos y revisión de routers no montados. Estas acciones se documentan como mejoras futuras y no como funcionalidades existentes.
En síntesis, la arquitectura actual es una base válida para un caso de estudio académico y para la evolución técnica del sistema. Su fortaleza principal está en integrar expediente clínico e inteligencia artificial; su deuda principal está en seguridad, trazabilidad persistente y formalización de la evolución del esquema de datos.
9. Referencias internas revisadas
Referencia	Uso
docs/documento-arquitectura.md	Documento técnico base conservado intacto.
README.md	Descripción del sistema, stack y módulos.
main.py	Routers montados y configuración FastAPI.
app/database.py	Conexión PostgreSQL y sesión SQLAlchemy.
app/models/models.py	Entidades y relaciones del dominio.
app/routers/	Endpoints REST.
app/schemas/	Contratos Pydantic.
app/service/multiagent_plan_service.py	Generación de plan con LangChain y Gemini.
app/service/gemini_plan_service.py	Servicio alterno de generación directa.
alembic/env.py	Configuración de migraciones.
frontend/src/App.tsx	Rutas principales del frontend.
frontend/src/pages/	Pantallas funcionales.
frontend/src/components/	Componentes y formularios clínicos.
frontend/src/services/	Consumo HTTP desde frontend.
frontend/src/types/index.ts	Tipos TypeScript del dominio.
frontend/package.json	Dependencias frontend.
requirements.txt	Dependencias backend.

