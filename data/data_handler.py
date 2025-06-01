from chromadb import PersistentClient

from .chunking import chunk_documents

def load_collection():
    return PersistentClient('./chroma_db').get_collection('documents')

def add_documents(collection, texts, filenames, chunk_max_words=400, chunk_overlap_sentences=1):
    chunks, metadata = chunk_documents(texts, filenames, chunk_max_words, chunk_overlap_sentences)
    
    id_start = collection.count()
    ids = [str(i) for i in range(id_start, id_start + len(chunks))]

    collection.add(documents=chunks, ids=ids, metadatas=metadata)