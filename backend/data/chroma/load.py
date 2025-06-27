from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from chromadb import PersistentClient
from embedding_model.load import MODEL_NAME

def load_collection(client, name: str):
    client = PersistentClient('data/chroma_db')
    embedding_func = SentenceTransformerEmbeddingFunction(model_name=MODEL_NAME)
    return client.get_collection(name=name, embedding_function=embedding_func) # type: ignore