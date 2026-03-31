from .db import engine, Base
from .model import Document  # noqa: F401


def init_db():
    Base.metadata.create_all(bind=engine)
