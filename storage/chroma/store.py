import chromadb
from models import EmbeddingFn
from uuid import uuid4

client = chromadb.PersistentClient(path="./storage/chroma/chunk_db")
collection = client.get_or_create_collection("chunks", embedding_function=EmbeddingFn())  # type: ignore



def add_chunks(chunks, doc_ids):
    chunk_ids = [str(uuid4()) for _ in range(len(chunks))]
    collection.add(
        ids=chunk_ids,
        documents=chunks,
        metadatas=[{"document_id": did} for did in doc_ids],
    )


def delete_chunks(doc_ids):
    collection.delete(where={"document_id": {"$in": doc_ids}})


def query_chunks(query, doc_ids, n_chunks):
    chunks = collection.query(
        query_texts=[query], n_results=n_chunks, where={"document_id": {"$in": doc_ids}}
    )["documents"]
    return chunks
