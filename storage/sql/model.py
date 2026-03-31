from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
)
from datetime import datetime, timezone
from .db import Base


def time_now():
    return datetime.now(timezone.utc)


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=time_now, nullable=False)
    number_chunks = Column(Integer, nullable=False)
    length = Column(Integer, nullable=False)
    content = Column(String, nullable=False)
