from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from chromadb import PersistentClient

from backend.models.generation import load_model
from backend.models.embedding import load_embedding_model, chroma_embedding_func
from backend.models.reranker import load_reranker

from backend.collections.router import collections_router
from backend.documents.router import documents_router
from backend.query.router import query_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.chroma = PersistentClient('backend/db/chroma_db').get_collection('documents', embedding_function=chroma_embedding_func) # type: ignore
    # app.state.generation_model = load_model()
    app.state.embedding_model = load_embedding_model()
    app.state.reranker = load_reranker()

    yield

    app.state.chroma = None
    app.state.generation_model = None
    app.state.embedding_model = None
    app.state.reranker = None

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(collections_router)
app.include_router(query_router)
app.include_router(documents_router)

