from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Usuario
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

class UsuarioCreate(BaseModel):
    nombre_completo: str
    email: str
    contrasena: str
    rol: str

class UsuarioUpdate(BaseModel):
    nombre_completo: str = None
    email: str = None
    contrasena: str = None
    rol: str = None

class UsuarioOut(BaseModel):
    id: int
    nombre_completo: str
    email: str
    rol: str
    fecha_registro: datetime

    class Config:
        orm_mode = True

@router.post("/", response_model=UsuarioOut)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = Usuario(
        nombre_completo=usuario.nombre_completo,
        email=usuario.email,
        contrasena=usuario.contrasena,
        rol=usuario.rol,
        fecha_registro=datetime.utcnow()
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@router.get("/", response_model=list[UsuarioOut])
def obtener_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

@router.get("/{usuario_id}", response_model=UsuarioOut)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.put("/{usuario_id}", response_model=UsuarioOut)
def actualizar_usuario(usuario_id: int, datos: UsuarioUpdate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(usuario, key, value)

    db.commit()
    db.refresh(usuario)
    return usuario

@router.delete("/{usuario_id}")
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.delete(usuario)
    db.commit()
    return {"mensaje": "Usuario eliminado exitosamente"}
