from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy import event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

engine = create_engine("sqlite:///./data/collections.db", echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Collection(Base):
    __tablename__ = 'collections'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    last_modified = Column(DateTime, default=datetime.datetime.now)

@event.listens_for(Collection, 'before_update')
def update_timestamp(mapper, connection, target):
    target.last_modified = datetime.datetime.utcnow()

Base.metadata.create_all(bind=engine)
