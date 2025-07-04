from sqlalchemy import create_engine, Column, String, Integer, DateTime, ForeignKey, event
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from .event_handlers import file_delete, file_insert, collection_rename

from datetime import datetime, timezone

def time_now():
    return datetime.now(timezone.utc)

engine = create_engine('sqlite:///backend/db/sql/sql_store.db', echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Collection(Base):
    __tablename__ = 'collections'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=time_now, nullable=False)
    last_modified = Column(DateTime, default=time_now, nullable=False)
    number_files = Column(Integer, nullable=False, default=0)

    files = relationship('File', back_populates='collection', cascade='all, delete-orphan')

class File(Base):
    __tablename__ = 'files'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    collection_id = Column(Integer, ForeignKey('collections.id'), nullable=False)
    uploaded_at = Column(DateTime, default=time_now, nullable=False)
    number_chunks = Column(Integer, nullable=False)
    length = Column(Integer, nullable=False)

    collection = relationship('Collection', back_populates='files')

event.listen(File, 'after_delete', file_delete)
event.listen(File, 'after_insert', file_insert)
event.listen(Collection, 'after_update', collection_rename)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)