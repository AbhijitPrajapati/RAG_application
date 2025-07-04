from sentence_transformers import SentenceTransformer
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

MODEL_NAME = 'BAAI/bge-small-en-v1.5'

chroma_embedding_func = SentenceTransformerEmbeddingFunction(model_name=MODEL_NAME, device='cuda')

def load_embedding_model():
    return SentenceTransformer(MODEL_NAME, device='cuda')