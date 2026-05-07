from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import models
from app.database import engine
from app.routers import pacientes, plan_alimentacion, usuarios
from app.routers import login,plan_nutricional
from app.routers import herramienta_must, examen_fisico, examenes_bioquimicos, r24, frecuencia_consumo_alimentos, datos_alimentarios, circunstancias_ambientales, antecedentes_patologicos

app = FastAPI(
    title="Sistema Nutricional Inteligente",
    description="API para gestionar pacientes, historiales clínicos y profesionales de la salud",
    version="1.0.0"
)

# CORS middleware antes de las rutas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ahora sí las rutas    
app.include_router(pacientes.router)
app.include_router(usuarios.router)
app.include_router(login.router)
app.include_router(herramienta_must.router)
app.include_router(examenes_bioquimicos.router)
app.include_router(examen_fisico.router)
app.include_router(r24.router)
app.include_router(frecuencia_consumo_alimentos.router)
app.include_router(datos_alimentarios.router)
app.include_router(circunstancias_ambientales.router)
app.include_router(antecedentes_patologicos.router)
app.include_router(plan_alimentacion.router)
app.include_router(plan_nutricional.router)


# Crear tablas
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "API del sistema nutricional en funcionamiento"}
