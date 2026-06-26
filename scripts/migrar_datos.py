import sys
import os
from datetime import datetime

# Añadir el directorio raíz al path para poder importar 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import engine
from app.models.models import Paciente, EvaluacionAntropometrica

def migrar_antropometria():
    print("Iniciando migración de datos antropométricos de Paciente a EvaluacionAntropometrica...")
    try:
        with Session(engine) as session:
            pacientes = session.query(Paciente).all()
            count = 0
            
            for p in pacientes:
                # Evitar duplicados si el script se ejecuta más de una vez
                existe = session.query(EvaluacionAntropometrica).filter_by(id_paciente=p.id).first()
                if not existe:
                    evaluacion = EvaluacionAntropometrica(
                        id_paciente=p.id,
                        peso_actual=p.peso_actual,
                        peso_usual=p.peso_usual,
                        talla=p.talla,
                        circunferencia_cintura=p.circunferencia_cintura,
                        ind_masa_corporal=p.ind_masa_corporal,
                        fecha_registro=datetime.utcnow()
                    )
                    session.add(evaluacion)
                    count += 1
            
            session.commit()
            print(f"¡Éxito! Se migraron {count} historiales antropométricos a la nueva tabla.")
            
            # Verificación rápida
            total_nuevos = session.query(EvaluacionAntropometrica).count()
            total_pacientes = session.query(Paciente).count()
            print(f"Total de pacientes en BD: {total_pacientes}")
            print(f"Total de registros en EvaluacionAntropometrica: {total_nuevos}")
            
    except Exception as e:
        print(f"Error durante la migración: {e}")

if __name__ == "__main__":
    migrar_antropometria()
