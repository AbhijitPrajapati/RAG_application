from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import contextmanager


Base = declarative_base()

DATABASE_URL = "sqlite:///storage/sql/db.db"

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)





@contextmanager
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
