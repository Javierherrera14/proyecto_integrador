# app/routers/login.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.models import models
from app.database import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    contrasena: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == request.email).first()
    if not usuario or usuario.contrasena != request.contrasena:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    return {
        "id": usuario.id,
        "nombre_completo": usuario.nombre_completo,
        "rol": usuario.rol
    }
