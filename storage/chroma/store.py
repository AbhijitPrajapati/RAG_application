import chromadb
from bm25_chroma import HybridRetriever
from models import EmbeddingFn
from uuid import uuid4

client = chromadb.PersistentClient(path="./storage/chroma/chunk_db")
collection = client.get_or_create_collection("chunks", embedding_function=EmbeddingFn())  # type: ignore
retriever = HybridRetriever(
    chroma_path="./storage/chroma/chunk_db",
    collection_name="chunks",
    embedding_function=EmbeddingFn(),
)


def add_chunks(chunks, doc_ids):
    chunk_ids = [str(uuid4()) for _ in range(len(chunks))]
    collection.add(
        ids=chunk_ids,
        documents=chunks,
        metadatas=[{"document_id": did} for did in doc_ids],
    )


def delete_chunks(doc_ids):
    collection.delete(where={"document_id": {"$in": doc_ids}})


def query_chunks(query, n_chunks):
    chunks = retriever.query(query, n_chunks)["documents"]
    return chunks
