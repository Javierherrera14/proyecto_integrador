# app/routers/login.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.models import models
from app.database import SessionLocal
from sqlalchemy.orm import Session
from app.utils.security import verify_password, get_password_hash

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
    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    # Verificamos si la contraseña coincide con el hash
    if not verify_password(request.contrasena, usuario.contrasena):
        # Fallback: Si no es un hash y coincide en texto plano, la actualizamos al hash (migración transparente)
        if usuario.contrasena == request.contrasena:
            usuario.contrasena = get_password_hash(request.contrasena)
            db.commit()
        else:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    return {
        "id": usuario.id,
        "nombre_completo": usuario.nombre_completo,
        "rol": usuario.rol
    }
