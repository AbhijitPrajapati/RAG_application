from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

engine = create_engine('sqlite:///./data/collections.db', echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Collection(Base):
    __tablename__ = 'collections'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    last_modified = Column(DateTime, default=datetime.now, nullable=False)
    number_files = Column(Integer, nullable=False, default=0)

# Base.metadata.create_all(bind=engine)

# s = SessionLocal()
# c = [Collection(name='training'), Collection(name='machine_learning'), Collection(name='misc')]
# s.add_all(c)
# s.commit()
# s.close()