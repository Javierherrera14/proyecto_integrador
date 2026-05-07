from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import ListaIntercambios
from app.schemas.Lista_intercambios import ListaIntercambios, ListaIntercambiosCreate, ListaIntercambiosUpdate

router = APIRouter(prefix="/lista_intercambios", tags=["lista_intercambios"])

@router.post("/", response_model=ListaIntercambios, status_code=status.HTTP_201_CREATED)
def crear_intercambio(datos: ListaIntercambiosCreate, db: Session = Depends(get_db)):
    nuevo = ListaIntercambios(**datos.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[ListaIntercambios])
def obtener_todos(db: Session = Depends(get_db)):
    return db.query(ListaIntercambios).all()

@router.get("/{intercambio_id}", response_model=ListaIntercambios)
def obtener_por_id(intercambio_id: int, db: Session = Depends(get_db)):
    intercambio = db.query(ListaIntercambios).filter(ListaIntercambios.id == intercambio_id).first()
    if not intercambio:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado")
    return intercambio

@router.put("/{intercambio_id}", response_model=ListaIntercambios)
def actualizar_intercambio(intercambio_id: int, nuevos_datos: ListaIntercambiosUpdate, db: Session = Depends(get_db)):
    intercambio = db.query(ListaIntercambios).filter(ListaIntercambios.id == intercambio_id).first()
    if not intercambio:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado")
    
    for key, value in nuevos_datos.dict(exclude_unset=True).items():
        setattr(intercambio, key, value)

    db.commit()
    db.refresh(intercambio)
    return intercambio

@router.delete("/{intercambio_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_intercambio(intercambio_id: int, db: Session = Depends(get_db)):
    intercambio = db.query(ListaIntercambios).filter(ListaIntercambios.id == intercambio_id).first()
    if not intercambio:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado")

    db.delete(intercambio)
    db.commit()
