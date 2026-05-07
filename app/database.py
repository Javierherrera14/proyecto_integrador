from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv  # 👈 agregas esto

load_dotenv()  # 👈 y cargas las variables del .env

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:jav1234@localhost:5434/bd_nutricion")

print("DATABASE_URL usada:", repr(DATABASE_URL))  # para debug

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
